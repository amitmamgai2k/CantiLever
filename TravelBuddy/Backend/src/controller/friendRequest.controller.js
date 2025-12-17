import FriendRequest from "../model/friendRequest.model.js";
import User from "../model/user.model.js";
import Notification from "../model/notification.model.js";
import { getIO } from "../../socket.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
         return res.status(400).json({ message: "Friend request already pending." });
      }
      if (existingRequest.status === 'accepted') {
         return res.status(400).json({ message: "You are already friends." });
      }

      // If rejected or cancelled, reinstate it
      existingRequest.status = 'pending';
      existingRequest.sender = senderId;
      existingRequest.receiver = receiverId;
      await existingRequest.save();

      // Notify Recipient
      const senderUser = await User.findById(senderId);
      const newNotification = await Notification.create({
          recipient: receiverId,
          sender: senderId,
          type: 'friend_request',
          message: `${senderUser.fullName} sent you a friend request.`,
          relatedId: existingRequest._id
      });
      const io = getIO();
      if(io) {
          io.to(`user:${receiverId}`).emit('newNotification', newNotification);
      }

      return res.status(200).json({ message: "Friend request sent successfully.", request: existingRequest });
    }

    const newRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId
    });

    await newRequest.save();

    // Notify Recipient
    const senderUser = await User.findById(senderId);
    const newNotification = await Notification.create({
          recipient: receiverId,
          sender: senderId,
          type: 'friend_request',
          message: `${senderUser.fullName} sent you a friend request.`,
          relatedId: newRequest._id
    });
    const io = getIO();
    if(io) {
          io.to(`user:${receiverId}`).emit('newNotification', newNotification);
    }

    return res.status(201).json({ message: "Friend request sent successfully.", request: newRequest });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    if (request.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to accept this request." });
    }

    request.status = 'accepted';
    await request.save();

    // Notify Sender that request was accepted
    const receiverUser = await User.findById(userId);
    const newNotification = await Notification.create({
          recipient: request.sender,
          sender: userId,
          type: 'friend_accept',
          message: `${receiverUser.fullName} accepted your friend request.`,
          relatedId: request._id
    });
    const io = getIO();
    if(io) {
          io.to(`user:${request.sender}`).emit('newNotification', newNotification);
    }

    return res.status(200).json({ message: "Friend request accepted.", request });

  } catch (error) {
     console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    // Allow sender to cancel or receiver to reject
    if (request.receiver.toString() !== userId && request.sender.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to reject/cancel this request." });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return res.status(200).json({ message: "Friend request rejected/cancelled." });

  } catch (error) {
     console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFriendStatus = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user.id;

        const request = await FriendRequest.findOne({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        });

        if (!request) return res.status(200).json({ status: 'none' });

        if (request.status === 'accepted') return res.status(200).json({ status: 'friends', request });

        if (request.status === 'pending') {
            if (request.sender.toString() === currentUserId) {
                return res.status(200).json({ status: 'sent', request });
            } else {
                return res.status(200).json({ status: 'received', request });
            }
        }

        return res.status(200).json({ status: 'none' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// New function to get all friends and requests
export const getSafeConnections = async (req, res) => {
    try {
        const userId = req.user.id;

        const sentRequests = await FriendRequest.find({ sender: userId, status: 'pending' }).populate('receiver', 'fullName profilePicture bio');
        const receivedRequests = await FriendRequest.find({ receiver: userId, status: 'pending' }).populate('sender', 'fullName profilePicture bio');
        const acceptedRequests = await FriendRequest.find({
            $or: [{ sender: userId }, { receiver: userId }],
            status: 'accepted'
        }).populate('sender', 'fullName profilePicture bio').populate('receiver', 'fullName profilePicture bio');

        const friends = acceptedRequests.map(req => {
            return req.sender._id.toString() === userId ? req.receiver : req.sender;
        });

        res.status(200).json({
            sent: sentRequests,
            received: receivedRequests,
            friends: friends
        });
    } catch (error) {
         console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

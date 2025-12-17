import PrivateChat from "../model/privateChat.model.js";
import PrivateMessage from "../model/privateMessage.model.js";
import User from "../model/user.model.js";
import { getIO } from "../../socket.js";
import Notification from "../model/notification.model.js";

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body; // The user to chat with

    if (!userId) {
      return res.status(400).json({ message: "UserId invalid" });
    }

    // Check if chat exists
    let isChat = await PrivateChat.find({
      $and: [
        { participants: { $elemMatch: { $eq: req.user._id } } },
        { participants: { $elemMatch: { $eq: userId } } }
      ]
    }).populate("participants", "-password").populate("lastMessage");

    isChat = await User.populate(isChat, {
      path: "lastMessage.sender",
      select: "fullName profilePicture email"
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      // Create new chat
      var chatData = {
        participants: [req.user._id, userId]
      };

      try {
        const createdChat = await PrivateChat.create(chatData);
        const FullChat = await PrivateChat.findOne({ _id: createdChat._id }).populate(
          "participants",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchChats = async (req, res) => {
  try {
    PrivateChat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "lastMessage.sender",
          select: "fullName profilePicture email"
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;

  if (!text || !chatId) {
    return res.status(400).json({ message: "Invalid data passed into request" });
  }

  var newMessage = {
    sender: req.user._id,
    text: text,
    chatId: chatId
  };

  try {
    var message = await PrivateMessage.create(newMessage);
    message = await message.populate("sender", "fullName apiPath profilePicture");
    message = await message.populate("chatId");
    message = await User.populate(message, {
      path: "chatId.participants",
      select: "fullName profilePicture email"
    });

    await PrivateChat.findByIdAndUpdate(req.body.chatId, {
      lastMessage: message
    });

    const io = getIO();
    if (io) {
        io.to(`private:${chatId}`).emit("message received", message);

        // Notify other participants (e.g., if they are not in the chat room but online)
        // Ideally handled by client checking active chat, but could emit 'newNotification' here too
        // Notify other participants
        const chat = await PrivateChat.findById(chatId);
        chat.participants.forEach(async (userId) => {
             if(userId.toString() !== req.user._id.toString()){
                  const notificationContent = {
                       recipient: userId,
                       sender: req.user._id,
                       type: 'message',
                       message: `New message from ${req.user.fullName}`,
                       relatedId: chatId
                  };

                  // Save to DB
                  const savedNotification = await Notification.create(notificationContent);

                  // Emit socket event with full object
                  io.to(`user:${userId}`).emit('newNotification', savedNotification);
             }
        });
    }

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const allMessages = async (req, res) => {
  try {
    const messages = await PrivateMessage.find({ chatId: req.params.chatId })
      .populate("sender", "fullName profilePicture email")
      .populate("chatId");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

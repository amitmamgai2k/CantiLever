import Chat from '../model/chat.model.js';
import Activity from '../model/activity.model.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import GroupMessage from '../model/groupMessage.model.js';
import { getIO } from '../../socket.js';

const populateParticipants = async (chatDoc) => {
  if (!chatDoc) return null;
  return chatDoc.populate('participants.userId', 'fullName profilePicture');
};

export const CreateChatGroup = asyncHandler(async (req, res) => {
  const { activityId, name, description, participants, privacy } = req.body;
  const userId = req.user._id;

  if (!activityId || !name || !participants) {
    throw new ApiError(400, 'Activity ID, name, and participants are required');
  }

  const activity = await Activity.findById(activityId);
  if (!activity) {
    throw new ApiError(404, 'Activity not found');
  }
  if (activity.groupExists) {
    throw new ApiError(400, 'Chat group already exists for this activity');
  }

  let parsedParticipants;
  try {
    parsedParticipants =
      typeof participants === 'string' ? JSON.parse(participants) : participants;
  } catch (error) {
    throw new ApiError(400, 'Invalid participants data format');
  }

  if (!Array.isArray(parsedParticipants) || parsedParticipants.length === 0) {
    throw new ApiError(400, 'At least one participant is required');
  }

  // ensure current user is admin and added once
  const participantMap = new Map();
  parsedParticipants.forEach((participant) => {
    if (participant?.userId) {
      participantMap.set(String(participant.userId), {
        userId: participant.userId,
        role: participant.role === 'admin' ? 'admin' : 'member'
      });
    }
  });
  participantMap.set(String(userId), { userId, role: 'admin' });

  let groupAvatar = null;
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult) {
      groupAvatar = uploadResult.secure_url;
    }
  }

  const chatGroup = await Chat.create({
    activityId,
    name: name.trim(),
    description: description?.trim() || '',
    avatar: groupAvatar,
    privacy: privacy || 'private',
    participants: Array.from(participantMap.values())
  });

  activity.groupExists = true;
  await activity.save();

  const populatedGroup = await populateParticipants(chatGroup);

  res
    .status(201)
    .json(new ApiResponse(201, populatedGroup, 'Chat group created successfully'));
});

export const getChatGroupByActivity = asyncHandler(async (req, res) => {
  const { activityId } = req.params;
  const chatGroup = await Chat.findOne({ activityId }).populate(
    'participants.userId',
    'fullName profilePicture'
  );

  if (!chatGroup) {
    throw new ApiError(404, 'Chat group not found for this activity');
  }

  res
    .status(200)
    .json(new ApiResponse(200, chatGroup, 'Chat group fetched successfully'));
});

export const joinChatGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  const chatGroup = await Chat.findById(chatId);
  if (!chatGroup) {
    throw new ApiError(404, 'Chat group not found');
  }

  const activity = await Activity.findById(chatGroup.activityId);
  if (!activity) {
    throw new ApiError(404, 'Activity not found for this group');
  }

  const isParticipant =
    activity.creator.toString() === userId.toString() ||
    activity.participants.some((participantId) => participantId.toString() === userId.toString());

  if (!isParticipant) {
    throw new ApiError(403, 'Join the activity before joining its chat group');
  }

  const alreadyInGroup = chatGroup.participants.some(
    (participant) => participant.userId.toString() === userId.toString()
  );

  if (!alreadyInGroup) {
    chatGroup.participants.push({ userId, role: 'member' });
    await chatGroup.save();
  }

  const populatedGroup = await populateParticipants(chatGroup);

  res
    .status(200)
    .json(new ApiResponse(200, populatedGroup, 'Joined chat group successfully'));
});

export const getUserChatGroups = asyncHandler(async (req, res) => {
  const chatGroups = await Chat.find({
    'participants.userId': req.user._id
  }).populate('participants.userId', 'fullName profilePicture');

  res.status(200).json(new ApiResponse(200, chatGroups, 'Chat groups fetched'));
});

export const getGroupMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const chatGroup = await Chat.findById(chatId);
  if (!chatGroup) {
    throw new ApiError(404, 'Chat group not found');
  }

  const isMember = chatGroup.participants.some(
    (participant) => participant.userId.toString() === req.user._id.toString()
  );
  if (!isMember) {
    throw new ApiError(403, 'Join the group to see messages');
  }

  const messages = await GroupMessage.find({ chatId })
    .populate('sender', 'fullName profilePicture')
    .sort({ createdAt: 1 });

  res.status(200).json(new ApiResponse(200, messages, 'Group messages fetched'));
});

export const sendGroupMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    throw new ApiError(400, 'Message text is required');
  }

  const chatGroup = await Chat.findById(chatId);
  if (!chatGroup) {
    throw new ApiError(404, 'Chat group not found');
  }

  const isMember = chatGroup.participants.some(
    (participant) => participant.userId.toString() === req.user._id.toString()
  );
  if (!isMember) {
    throw new ApiError(403, 'Join the group to send messages');
  }

  const message = await GroupMessage.create({
    chatId,
    sender: req.user._id,
    text: text.trim()
  });

  const populatedMessage = await message.populate('sender', 'fullName profilePicture');

  const io = getIO();
  if (io) {
    io.to(`chat:${chatId}`).emit('chatMessage', populatedMessage);
  }

  res.status(201).json(new ApiResponse(201, populatedMessage, 'Message sent'));
});

import Message from '../model/message.model.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getMessagesByActivity = asyncHandler(async (req, res, next) => {
  const activityId = req.params.activityId;

  if (!activityId) {
    return next(new ApiError(400, 'Activity ID is required'));
  }

  const messages = await Message.find({ activityId })
    .populate('sender', 'fullName') // get sender name
    .sort({ createdAt: 1 }); // oldest first

  res.json(new ApiResponse(200, messages, 'Messages loaded'));
});

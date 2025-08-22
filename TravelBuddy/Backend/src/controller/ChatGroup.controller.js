import Chat from "../model/chat.model.js";
import Activity from "../model/activity.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const CreateChatGroup = asyncHandler(async (req, res) => {

    const { activityId, name, description, participants, privacy } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!activityId || !name || !participants) {
      throw new ApiError("Activity ID, name, and participants are required", 400);
    }
    const ActivityExists = await Activity.findById(activityId);
    if (!ActivityExists) {
      throw new ApiError("Activity not found", 404);
    }
    if (ActivityExists.groupExists) {
      throw new ApiError("Chat group already exists for this activity", 400);
    }
    ActivityExists.groupExists = true;
    await ActivityExists.save();

    // Parse participants if it's a string (from FormData)
    let parsedParticipants;
    try {
      parsedParticipants = typeof participants === 'string' ? JSON.parse(participants) : participants;
    } catch (error) {
      throw new ApiError("Invalid participants data format", 400);
    }

    // Validate participants array
    if (!Array.isArray(parsedParticipants) || parsedParticipants.length === 0) {
      throw new ApiError("At least one participant is required", 400);
    }

    console.log('Processing chat group creation:', {
      activityId,
      name,
      description,
      privacy,
      participantsCount: parsedParticipants.length,
      hasFile: !!req.file
    });

    // Handle file upload to Cloudinary
    let groupAvatar = null;
    if (req.file) {
      console.log('Uploading file to Cloudinary:', req.file.path);

      try {
        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
        if (cloudinaryResult) {
          groupAvatar = cloudinaryResult.secure_url;
          console.log('File uploaded successfully to Cloudinary:', groupAvatar);
        } else {
          console.warn('File upload to Cloudinary failed, proceeding without avatar');
        }
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);

      }
    }

    // Create chat group
    const chatGroup = await Chat.create({
      activityId,
      name: name.trim(),
      description: description?.trim() || '',
      avatar: groupAvatar,
      privacy: privacy || 'private',
      participants: parsedParticipants,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    chatGroup.participants.push({ userId, role: 'admin' });
    await chatGroup.save();

    console.log('Chat group created successfully:', chatGroup._id);

    res.status(201).json(new ApiResponse("Chat group created successfully", chatGroup));


});

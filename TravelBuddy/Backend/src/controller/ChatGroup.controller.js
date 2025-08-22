import Chat from "../model/chat.model";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import uploadOnCloudinary from "../utils/cloudinary.js";
export const CreateChatGroup = asyncHandler(async(req,res)=>{
    const { activityId, name, description, privacy, participants } = req.body;

    if (!activityId || !name || !description  || !participants) {
        throw new ApiError("All fields are required", 400);
    }
    const localFilePath = req.file.path;
    if (!localFilePath) {
        throw new ApiError("Avatar image is required", 400);
    }

    const groupicon = await uploadOnCloudinary(localFilePath);


    const chatGroup = await Chat.create({
        activityId,
        name,
        description,
        avatar: groupicon.secure_url,
        participants
    });

    res.status(201).json(new ApiResponse("Chat group created successfully", chatGroup));
})

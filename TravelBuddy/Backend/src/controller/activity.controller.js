import Activity from "../model/activity.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createActivity = asyncHandler(async (req, res) => {


        const{title, description, date, location,participantsLimit} = req.body;
        if(!title || !description || !date || !location){
            throw new ApiError(400, "All fields are required");
        }


        const[datePart, timePart] = date.split('T');
        const activity = await Activity.create({
            title,
            description,
            date: datePart,
            time: timePart,
            location,
            participantsLimit,
            creator:req.user._id
        });
        res.json(new ApiResponse(200, activity, 'Activity created successfully'));






});
export const listActivities = asyncHandler(async (req, res, next) => {
  const activities = await Activity.find().populate('creator', 'fullName');
  res.json(new ApiResponse(200, activities, 'All activities'));
});

export const joinActivity = asyncHandler(async (req, res, next) => {
  try {
    const activityId = req.params.id;

  const activity = await Activity.findById(activityId);
  if (!activity) {
    return next(new ApiError(404, 'Activity not found'));
  }
  if (activity.participants.includes(req.user._id)) {
    return next(new ApiError(400, 'You have already joined this activity'));
  }
  if (activity.participants.length >= activity.participantLimit) {
    return next(new ApiError(400, 'Activity is full'));
  }

  activity.participants.push(req.user._id);
  await activity.save();

  res.json(new ApiResponse(200, activity, 'Successfully joined activity'));
  } catch (error) {
    throw new ApiError(500, "Server error", [error.message]);

  }
});
export const leaveActivity = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const activityId = req.params.id;
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return next(new ApiError(404, 'Activity not found'));
        }
        if (!activity.participants.includes(userId)) {
            return next(new ApiError(400, 'You have not joined this activity'));
        }
        activity.participants.pull(req.user._id);
        await activity.save();
        res.json(new ApiResponse(200, activity, 'Successfully left activity'));

    } catch (error) {
        throw new ApiError(500, "Server error", [error.message]);

    }
})
export const deleteActivity = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const activityId = req.params.id;
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return next(new ApiError(404, 'Activity not found'));
        }
        if (activity.creator.toString() !== userId) {
            return next(new ApiError(401, 'You are not authorized to delete this activity'));
        }
        await activity.remove();
        res.json(new ApiResponse(200, null, 'Activity deleted successfully'));
    } catch (error) {
        throw new ApiError(500, "Server error", [error.message]);
    }
})
export const updateActivity = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const activityId = req.params.id;
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return next(new ApiError(404, 'Activity not found'));
        }
        if (activity.creator.toString() !== userId) {
            return next(new ApiError(401, 'You are not authorized to update this activity'));
        }
        activity.title = req.body.title || activity.title;
        activity.description = req.body.description || activity.description;
        activity.date = req.body.date || activity.date;
        activity.location = req.body.location || activity.location;
        activity.participantLimit = req.body.participantsLimit || activity.participantLimit;
        await activity.save();
        res.json(new ApiResponse(200, activity, 'Activity updated successfully'));
    } catch (error) {
        throw new ApiError(500, "Server error", [error.message]);
    }
})

export const getSingleActivity = asyncHandler(async (req, res, next) => {
    try {
        const activityId = req.params.id;
        const activity = await Activity.findById(activityId).populate('creator', 'fullName');
        if (!activity) {
            return next(new ApiError(404, 'Activity not found'));
        }
        res.json(new ApiResponse(200, activity, 'Single activity'));
    } catch (error) {
        throw new ApiError(500, "Server error", [error.message]);
    }
})
export const getNearbyActivities = asyncHandler(async (req, res, next) => {
    try {
        const { latitude, longitude } = req.query;
        const activities = await Activity.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });
        res.json(new ApiResponse(200, activities, 'Nearby activities'));
    } catch (error) {
        throw new ApiError(500, "Server error", [error.message]);
    }
});

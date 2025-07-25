import { Router } from "express";
import { createActivity, nearbyActivities,joinActivity,leaveActivity,deleteActivity,updateActivity,getSingleActivity ,getNearbyActivities} from "../controller/activity.controller.js";
import { authUser } from "../middleware/auth.middleware.js";


const router = Router();

router.post('/create-activity', authUser, createActivity);

router.post('/get-nearby-activities', authUser, nearbyActivities);

router.post('/join-activity/:id', authUser, joinActivity);

router.post('/leave-activity/:id', authUser, leaveActivity);

router.delete('/delete-activity/:id', authUser, deleteActivity);

router.put('/update-activity/:id', authUser, updateActivity);

router.get('/single-activity/:id', authUser, getSingleActivity);

router.get('/nearby-activities', authUser, getNearbyActivities);


export default router;
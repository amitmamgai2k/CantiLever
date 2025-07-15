import express from 'express';
import { getMessagesByActivity } from '../controller/message.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/:activityId', authUser, getMessagesByActivity);

export default router;

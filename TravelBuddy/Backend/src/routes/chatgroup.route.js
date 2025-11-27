
import express from 'express';
import { uploadAvatar } from '../middleware/multer.middleware.js';
import {
  CreateChatGroup,
  getChatGroupByActivity,
  joinChatGroup,
  getUserChatGroups,
  getGroupMessages,
  sendGroupMessage
} from '../controller/chatgroup.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create-group', authUser, uploadAvatar, CreateChatGroup);
router.get('/activity/:activityId', authUser, getChatGroupByActivity);
router.get('/', authUser, getUserChatGroups);
router.post('/:chatId/join', authUser, joinChatGroup);
router.get('/:chatId/messages', authUser, getGroupMessages);
router.post('/:chatId/messages', authUser, sendGroupMessage);

export default router;


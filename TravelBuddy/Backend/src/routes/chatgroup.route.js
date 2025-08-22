
import express from 'express';
import { uploadAvatar } from '../middleware/multer.middleware.js';
import { CreateChatGroup } from '../controller/chatgroup.controller.js';


import { authUser } from '../middleware/auth.middleware.js';;

const router = express.Router();

// Error handling middleware for multer


// Routes
router.post('/create-group',
  authUser,
  uploadAvatar,
  CreateChatGroup

);

export default router;


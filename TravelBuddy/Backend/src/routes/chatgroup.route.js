import express from 'express';
import { CreateChatGroup } from '../controller/ChatGroup.controller.js';


const router = express.Router();


router.post('/create-group', CreateChatGroup);

export default router;

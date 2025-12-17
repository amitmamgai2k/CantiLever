import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { accessChat, fetchChats, sendMessage, allMessages } from "../controller/privateChat.controller.js";

const router = Router();

router.post("/", authUser, accessChat);
router.get("/", authUser, fetchChats);
router.post("/message", authUser, sendMessage);
router.get("/message/:chatId", authUser, allMessages);

export default router;

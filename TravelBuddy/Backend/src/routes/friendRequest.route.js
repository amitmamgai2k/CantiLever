import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendStatus,
  getSafeConnections
} from "../controller/friendRequest.controller.js";

const router = Router();

router.post('/send', authUser, sendFriendRequest);
router.post('/accept', authUser, acceptFriendRequest);
router.post('/reject', authUser, rejectFriendRequest);
router.get('/status/:otherUserId', authUser, getFriendStatus);
router.get('/connections', authUser, getSafeConnections);

export default router;

import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { getNotifications, markAsRead, markAllAsRead } from "../controller/notification.controller.js";

const router = Router();

router.get('/', authUser, getNotifications);
router.put('/:id/read', authUser, markAsRead);
router.put('/read-all', authUser, markAllAsRead);

export default router;

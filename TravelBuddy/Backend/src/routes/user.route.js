import { Router } from "express";
import { registerUser, loginUser } from "../controller/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";


const router = Router();
// Register route
router.post('/register', registerUser);
// Login route
router.post('/login',authUser, loginUser);

export default router;
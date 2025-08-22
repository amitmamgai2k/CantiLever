import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUserProfile, updateUser, deleteUser, getCurrentUser,updateUserLocation } from "../controller/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";


const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser);
router.post('/current-location', authUser, updateUserLocation);
router.get('/me', authUser, getCurrentUser);

router.post('/logout', authUser, logoutUser);

router.get('/profile', authUser, getUserProfile);

router.post('/update-profile', authUser, updateUser);

router.delete('/delete', authUser, deleteUser);


export default router;
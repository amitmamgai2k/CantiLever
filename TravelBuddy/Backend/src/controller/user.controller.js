import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';



export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      throw new ApiError(400, "Full name, email, and password are required");

    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    throw new ApiResponse(201, { userId: newUser._id }, "User registered successfully");

  } catch (err) {
    throw new ApiError(500, "Server error", [err.message]);
  }
});


export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    user.isOnline = true;
    await user.save();

    throw new ApiResponse(200, { token }, "Login successful");

  } catch (err) {
    throw new ApiError(500, "Server error", [err.message]);
  }
});
export const logoutUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    user.isOnline = false;
    user.socketId = null;
    await user.save();

    throw new ApiResponse(200, {}, "Logout successful");
  } catch (err) {
    throw new ApiError(500, "Server error", [err.message]);
  }
});

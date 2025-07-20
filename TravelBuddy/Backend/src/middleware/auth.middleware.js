import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/AsyncHandler.js';

export const authUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);




    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    throw new ApiError(401, "Not authorized, token invalid");
  }
});

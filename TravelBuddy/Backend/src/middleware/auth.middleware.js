import User from '../model/user.model.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';

import jwt from 'jsonwebtoken';

export const authUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new ApiError(401, 'No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid token'));
  }
});
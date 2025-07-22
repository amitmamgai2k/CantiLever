import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';



export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password,mobile } = req.body;

  if (!fullName || !email || !password || !mobile) {
    throw new ApiError(400, "Full name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    mobile
  });

  await newUser.save();

  return res.status(201).json(
    new ApiResponse(201, { userId: newUser._id }, "User registered successfully")
  );
});



export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.isOnline = true;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    }, "User logged in successfully")
  );
});

export const logoutUser = asyncHandler(async (req, res) => {



  const user = await User.findById(req.user._id);
  user.isOnline = false;
  await user.save();
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { user: req.user }, "User fetched successfully")
  );
});
export const updateUserLocation = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    console.log(userId);

    const { lat, lng } = req.body;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    user.currentLocation.lat = lat;
    user.currentLocation.lng = lng;
    console.log('User location updated successfully');
    await user.save();
    return res.status(200).json(
      new ApiResponse(200, user, "User location updated successfully")

    );








});


export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(
      new ApiResponse(200, user, "User profile retrieved successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Server error", [err.message]);
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      fullName,
      password,
      profilePicture,
      phoneNumber,
      bio,
      currentLocation,
      futureDestinations,
      interests,
      socialLinks,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    if(profilePicture){
      const profilePictureLocalPath = req.file?.path;
      if (profilePictureLocalPath) {
        const profilePictureResponse = await uploadOnCloudinary(profilePictureLocalPath);
        if (profilePictureResponse) {
          profilePicture = profilePictureResponse.secure_url;
        }
    }
  }


    if (fullName !== undefined) user.fullName = fullName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    if (bio !== undefined) user.bio = bio;
    if (futureDestinations !== undefined) user.futureDestinations = futureDestinations;
    if (interests !== undefined) user.interests = interests;

    if (currentLocation !== undefined) {


      user.currentLocation = {
        lat: currentLocation.lat ?? user.currentLocation?.lat,
        lng: currentLocation.lng ?? user.currentLocation?.lng
      };
    }

    if (socialLinks !== undefined) {
      user.socialLinks = {
        instagram: socialLinks.instagram ?? user.socialLinks?.instagram,
        facebook: socialLinks.facebook ?? user.socialLinks?.facebook,
        linkedin: socialLinks.linkedin ?? user.socialLinks?.linkedin
      };
    }

    if (password !== undefined) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json(
      new ApiResponse(200, user, "User updated successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Server error", [err.message]);
  }
});
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new ApiError(404, "User not found");
    return res.status(200).json(
      new ApiResponse(200, null, "User deleted successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Server error", [err.message]);
  }
});



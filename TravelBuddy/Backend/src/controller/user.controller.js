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

  const existingUser = await User.findOne({ email, mobile });
  if (existingUser) {
    throw new ApiError(400, "User with this email or mobile already exists");
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
  const { lat, lng } = req.body;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new ApiError(400, "Latitude and longitude are required");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.currentLocation.lat = lat;
  user.currentLocation.lng = lng;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, { user }, "User location updated successfully")
  );
});


export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
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
    const userId = req.user._id;
    console.log('userId', userId);

    let {
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

    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Handle profile picture upload (multer file upload)
    if (req.file) {
        const profilePictureLocalPath = req.file.path;
        const profilePictureResponse = await uploadOnCloudinary(profilePictureLocalPath);
        if (profilePictureResponse) {
            user.profilePicture = profilePictureResponse.secure_url;
        }
    }
    // Handle profile picture as base64 string (from frontend)
    else if (profilePicture && profilePicture.startsWith('data:image')) {
        // If you want to handle base64 images, you'll need to convert and upload
        // For now, just store the base64 string
        user.profilePicture = profilePicture;
    }

    // Update fields only if they are provided (not undefined)
    if (fullName !== undefined) user.fullName = fullName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;
    if (futureDestinations !== undefined) user.futureDestinations = futureDestinations;
    if (interests !== undefined) user.interests = interests;

    // Handle nested object updates properly
    if (currentLocation !== undefined) {
        user.currentLocation = {
            lat: currentLocation.lat !== undefined ? currentLocation.lat : user.currentLocation?.lat,
            lng: currentLocation.lng !== undefined ? currentLocation.lng : user.currentLocation?.lng
        };
    }

    if (socialLinks !== undefined) {
        user.socialLinks = {
            instagram: socialLinks.instagram !== undefined ? socialLinks.instagram : user.socialLinks?.instagram,
            facebook: socialLinks.facebook !== undefined ? socialLinks.facebook : user.socialLinks?.facebook,
            linkedin: socialLinks.linkedin !== undefined ? socialLinks.linkedin : user.socialLinks?.linkedin
        };
    }

    // Handle password update
    if (password !== undefined && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    console.log('User updated successfully');

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json(
        new ApiResponse(200, userResponse, "User updated successfully")
    );
});

// Alternative: More efficient approach using findByIdAndUpdate
export const updateUserEfficient = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    let {
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

    console.log('Request body:', req.body);

    // Build update object with only provided fields
    const updateData = {};

    // Handle profile picture upload
    if (req.file) {
        const profilePictureLocalPath = req.file.path;
        const profilePictureResponse = await uploadOnCloudinary(profilePictureLocalPath);
        if (profilePictureResponse) {
            updateData.profilePicture = profilePictureResponse.secure_url;
        }
    } else if (profilePicture && profilePicture.startsWith('data:image')) {
        updateData.profilePicture = profilePicture;
    }

    // Add fields to update object only if they exist
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (bio !== undefined) updateData.bio = bio;
    if (futureDestinations !== undefined) updateData.futureDestinations = futureDestinations;
    if (interests !== undefined) updateData.interests = interests;
    if (currentLocation !== undefined) updateData.currentLocation = currentLocation;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;

    // Handle password separately due to hashing requirement
    if (password !== undefined && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json(
            new ApiResponse(400, null, "No data provided for update")
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        {
            new: true,
            runValidators: true,
            select: '-password' // Exclude password from response
        }
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }



    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User updated successfully")
    );
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

const haversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getNearbyActiveUsers = asyncHandler(async (req, res) => {
  const parsedLat =
    req.query.lat !== undefined ? parseFloat(req.query.lat) : req.user.currentLocation?.lat;
  const parsedLng =
    req.query.lng !== undefined ? parseFloat(req.query.lng) : req.user.currentLocation?.lng;
  const radiusKm = req.query.radiusKm ? parseFloat(req.query.radiusKm) : 20;

  if (
    parsedLat === undefined ||
    Number.isNaN(parsedLat) ||
    parsedLng === undefined ||
    Number.isNaN(parsedLng)
  ) {
    throw new ApiError(400, "Latitude and longitude are required");
  }

  const activeUsers = await User.find({
    _id: { $ne: req.user._id },
    isOnline: true,
    'currentLocation.lat': { $ne: null },
    'currentLocation.lng': { $ne: null }
  }).select('fullName profilePicture bio interests currentLocation createdAt');

  const nearbyUsers = activeUsers
    .map((user) => {
      const distanceKm = haversineDistanceKm(
        parsedLat,
        parsedLng,
        user.currentLocation.lat,
        user.currentLocation.lng
      );

      return {
        _id: user._id,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        bio: user.bio,
        interests: user.interests,
        currentLocation: user.currentLocation,
        distanceKm: Number(distanceKm.toFixed(2))
      };
    })
    .filter((user) => user.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users: nearbyUsers,
        origin: { lat: parsedLat, lng: parsedLng },
        radiusKm
      },
      "Nearby active users fetched successfully"
    )
  );
});



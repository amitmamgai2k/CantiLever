import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    required: true
  },

  profilePicture: {
    type: String,
    default: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'
  },

  bio: {
    type: String,
    default: ''
  },

  currentLocation: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }

  },

  futureDestinations: [
    {
      name: String,
      lat: Number,
      lng: Number,
      startDate: Date,
      endDate: Date
    }
  ],

  interests: [String],

  socialLinks: {
    instagram: String,
    facebook: String,
    linkedin: String
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  socketId: {
    type: String,
    default: null
  },
  JoinActivity: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity'
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);



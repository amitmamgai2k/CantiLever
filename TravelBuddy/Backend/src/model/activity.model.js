import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      },
      formattedAddress: {
        type: String,
        required: true
      }
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    participantLimit: {
      type: Number,
      default: 10
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);
activitySchema.index({ location: '2dsphere' });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;

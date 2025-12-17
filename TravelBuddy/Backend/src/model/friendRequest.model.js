import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

// Ensure unique combination of sender and receiver to prevent duplicate requests
friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export default mongoose.model("FriendRequest", friendRequestSchema);

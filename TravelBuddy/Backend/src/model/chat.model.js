import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  avatar: { type: String, default: 'https://via.placeholder.com/150' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  privacy: { type: String, enum: ["public", "private"], default: "private" },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String, enum: ["admin", "member"], default: "member" }
    }
  ]
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;

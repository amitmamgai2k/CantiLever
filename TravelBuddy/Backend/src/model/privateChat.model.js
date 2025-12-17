import mongoose from "mongoose";

const privateChatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PrivateMessage"
  }
}, { timestamps: true });

export default mongoose.model("PrivateChat", privateChatSchema);

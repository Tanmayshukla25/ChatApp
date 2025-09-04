import mongoose from "mongoose";

const messageSubSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    text: { type: String },
    fileUrl: { type: String },
    fileType: { type: String },
    fileName: { type: String },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: String, required: true }], 
    messages: [messageSubSchema], 
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: String,
    receiver: String,
    text: String,
  },
  { timestamps: true, default: Date.now }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;

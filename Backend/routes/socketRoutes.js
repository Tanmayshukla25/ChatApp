import express from "express";
import Conversation from "../models/messageSchema.js";
import { uploadMessageFile } from "../Middleware/uploadMessageFile.js";

const router = express.Router();


router.post("/upload", uploadMessageFile.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      url: req.file.path, 
      mimetype: req.file.mimetype,
      filename: req.file.originalname,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: "File upload failed" });
  }
});


router.get("/:sender/:receiver", async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
      return res.json([]);
    }

    res.json(conversation.messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

export default router;

import express from "express";
import { uploadMessageFile } from "../MiddleWare/uploadMessageFile.js";

const router = express.Router();


router.get("/", (req, res) => {
  res.send("Socket route working ✅");
});

router.post("/upload", uploadMessageFile.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    return res.json({
      url: req.file.path,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;

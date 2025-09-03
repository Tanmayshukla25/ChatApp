import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const messageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_files",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif", "pdf", "docx", "txt"],
    public_id: (req, file) => `msg-${Date.now()}`, 
  },
});

export const uploadMessageFile = multer({ storage: messageStorage });

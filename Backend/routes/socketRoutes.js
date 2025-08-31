import express from "express";

const router = express.Router();


router.get("/", (req, res) => {
  res.send("Socket route working");
});

export default router;

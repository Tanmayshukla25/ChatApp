import jwt from "jsonwebtoken";
import "dotenv/config";

export function checkToken(req, res, next) {
  const token = req.cookies.userToken;

  if (!token) return res.status(401).send({ message: "No Token Found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.User = {
      _id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(402).json({ message: "Invalid or expired token" });
  }
}

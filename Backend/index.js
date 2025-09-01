import express from "express";
import cors from "cors";
import "dotenv/config";
import connectToDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import http from "http";                
import { Server } from "socket.io";     
import { socketHandler } from "./controllers/socketController.js";

const app = express();
const port = process.env.PORT;

const allowedOrigins = [process.env.DEPLOYED_FRONTEND_URL];
const localhostRegex = /^(https:\/\/localhost:\d+|http:\/\/localhost:\d+)$/;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || localhostRegex.test(origin)) {
      return callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use("/user", userRouter);


connectToDB();


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || localhostRegex.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS (Socket.IO)"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});



socketHandler(io);

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});

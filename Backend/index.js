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


const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


socketHandler(io);

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});

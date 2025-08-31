
import Message from "../models/messageSchema.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);


    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`${userId} joined room`);
    });

   
   socket.on("sendMessage", async ({ sender, receiver, text }) => {
  try {
    const newMessage = new Message({ sender, receiver, text });
    await newMessage.save();

    
    io.to(receiver).emit("receiveMessage", newMessage);
    io.to(sender).emit("receiveMessage", newMessage);

  } catch (err) {
    console.error("Error saving message:", err);
  }
});


 
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

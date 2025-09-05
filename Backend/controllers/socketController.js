import Conversation from "../models/messageSchema.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`📌 ${userId} joined room`);
    });

    socket.on(
      "sendMessage",
      async ({ sender, receiver, text, fileUrl, fileType, fileName }) => {
        try {
          console.log("📩 Incoming Message:", {
            sender,
            receiver,
            text,
            fileUrl,
            fileType,
            fileName,
          });

          let conversation = await Conversation.findOne({
            participants: { $all: [sender.toString(), receiver.toString()] },
          });

          if (!conversation) {
            conversation = new Conversation({
              participants: [sender.toString(), receiver.toString()],
              messages: [],
            });
            console.log("🆕 New conversation created");
          }

          const newMessage = {
            sender: sender.toString(),
            receiver: receiver.toString(),
            text: text || "",
            fileUrl: fileUrl || null,
            fileType: fileType || null,
            fileName: fileName || null,
            createdAt: new Date(),
          };

          conversation.messages.push(newMessage);
          conversation.markModified("messages");
          await conversation.save();

          console.log("✅ Message saved successfully:", newMessage);

          io.to(receiver.toString()).emit("receiveMessage", newMessage);
          io.to(sender.toString()).emit("receiveMessage", newMessage);
        } catch (err) {
          console.error("❌ Error saving message:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};


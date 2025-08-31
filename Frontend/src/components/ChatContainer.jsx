import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import UserImg from "../assets/Avtarimg.png";
import { LuSendHorizontal } from "react-icons/lu";
import { RiGalleryLine } from "react-icons/ri";
import UserContext from "../Pages/UserContext";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const ChatContainer = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user } = useContext(UserContext);

  const currentUserId = user?._id;

  useEffect(() => {
    socket.emit("join", currentUserId);

    socket.on("receiveMessage", (item) => {
      if (
        (item.sender === selectedUser?._id &&
          item.receiver === currentUserId) ||
        (item.receiver === selectedUser?._id && item.sender === currentUserId)
      ) {
        setMessages((prev) => [...prev, item]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser]);

  const sendMessage = () => {
    if (text.trim() && selectedUser) {
      socket.emit("sendMessage", {
        sender: currentUserId,
        receiver: selectedUser._id,
        text,
        timestamp: new Date().toISOString(),
      });
      setText("");
    }
  };

  return (
    <div className="bg-[#12101a] text-white flex flex-col h-full">
      {selectedUser ? (
        <div className="p-3 border-b border-gray-700 flex items-center gap-3">
          <div>
            <img
              src={selectedUser.image || UserImg}
              alt=""
              className="w-[45px] aspect-[1/1] rounded-full"
            />
          </div>
          <div>
            <h2 className="font-bold">{selectedUser.name}</h2>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <p>Select a user to chat</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`mb-2 ${
              item.sender === currentUserId ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                item.sender === currentUserId ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {item.text}
            </span>
            <span className="text-xs text-gray-300 block mt-1 text-right">
              {new Date(item.timestamp || item.createdAt).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="p-3 border-t w-[50%] border-white fixed bottom-0 flex gap-2">
          <input
            className="flex-1 p-2 pl-3 w-full relative bg-gray-800 text-white rounded-2xl"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
          />
          <RiGalleryLine className="absolute right-32 top-6" size={20} />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4  flex items-center gap-2 rounded-2xl"
          >
            <span> Send </span>{" "}
            <div>
              <LuSendHorizontal />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;

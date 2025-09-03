import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import UserImg from "../assets/Avtarimg.png";
import { LuSendHorizontal } from "react-icons/lu";
import { RiGalleryLine } from "react-icons/ri";
import { BsChatDots } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { MdWavingHand } from "react-icons/md";
import UserContext from "../Pages/UserContext";
import { Link } from "react-router-dom";
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/socket/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.url) {
        socket.emit("sendMessage", {
          sender: currentUserId,
          receiver: selectedUser._id,
          text: "", 
          fileUrl: data.url,
          fileType: data.mimetype,
          fileName: data.filename,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

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

  const WelcomeScreen = () => (
    <div className="flex items-center justify-center flex-1 bg-gradient-to-br from-[#1a1625] to-[#12101a]">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-6 relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <MdWavingHand className="text-white text-4xl animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome back, {user?.name || "User"}!
        </h2>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Choose a conversation from your contacts to start chatting
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <BsChatDots className="text-blue-400" />
            </div>
            <span>Instant messaging</span>
          </div>

          <div className="flex items-center justify-center gap-3 mr-8 text-gray-400">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <RiGalleryLine className="text-purple-400" />
            </div>
            <span>Share photos</span>
          </div>

          <div className="flex items-center justify-center gap-3 ml-6 text-gray-400">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <FiUsers className="text-green-400" />
            </div>
            <span>Connect with friends</span>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-gray-300">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Select a contact to begin
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#12101a] text-white flex flex-col h-full">
      {selectedUser ? (
        <>
       
          <div className="p-4 border-b border-gray-700 flex items-center gap-3 bg-gradient-to-r from-[#1a1625] to-[#12101a]">
            <div className="relative">
              {selectedUser?.image ? (
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-[45px] aspect-[1/1] rounded-full object-cover"
                />
              ) : (
                <div className="w-[45px] h-[45px] rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                  {selectedUser?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#12101a]"></div>
            </div>
            <div>
              <h2 className="font-bold text-lg">{selectedUser.name}</h2>
              <p className="text-sm text-green-400">Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#12101a] to-[#0f0d16]">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <BsChatDots className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((item, index) => {
                const isSender = item.sender === currentUserId;
                return (
                  <div
                    key={index}
                    className={`mb-4 flex ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-xs shadow-lg ${
                        isSender
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                
                      {item.fileUrl ? (
                        item.fileType?.startsWith("image/") ? (
                          <img
                            src={item.fileUrl}
                            alt={item.fileName}
                            className="max-w-[200px] rounded-lg"
                          />
                        ) : (
                          <Link
                            to={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-400"
                          >
                            📄 {item.fileName || "Download File"}
                          </Link>
                        )
                      ) : (
                        <span>{item.text}</span>
                      )}

                   
                      <span className="text-xs text-gray-300 block mt-1 text-right">
                        {new Date(
                          item.timestamp || item.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 border-t border-gray-700 fixed bottom-0 w-[50%] bg-[#1a1625]">
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input
                  className="w-full p-3 pl-4 pr-12 bg-gray-800 text-white rounded-2xl border border-gray-600 focus:border-blue-500 focus:outline-none transition-all duration-200"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <input
                  type="file"
                  id="chatFile"
                  accept="image/png, image/jpeg, application/pdf, .docx, .txt"
                  hidden
                  onChange={handleFileUpload}
                />

                <label
                  htmlFor="chatFile"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <RiGalleryLine size={20} />
                </label>
              </div>
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 flex items-center gap-2 rounded-2xl transition-all duration-200 shadow-lg"
              >
                <span className="font-medium">Send</span>
                <LuSendHorizontal />
              </button>
            </div>
          </div>
        </>
      ) : (
        <WelcomeScreen />
      )}
    </div>
  );
};

export default ChatContainer;

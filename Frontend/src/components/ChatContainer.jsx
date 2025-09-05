import React, { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { LuSendHorizontal } from "react-icons/lu";
import { RiGalleryLine } from "react-icons/ri";
import { BsChatDots } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { MdWavingHand } from "react-icons/md";
import UserContext from "../Pages/UserContext";
import { Link } from "react-router-dom";
import instance from "../Pages/axiosConfig";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const ChatContainer = ({ selectedUser, messages, setMessages }) => {
  const [text, setText] = useState("");
  const { user } = useContext(UserContext);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null); // Add ref for the messages container

  const currentUserId = user?._id;

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUserId) return;

      try {
        const res = await instance.get(
          `/socket/${currentUserId}/${selectedUser._id}`
        );

        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else if (res.data.messages) {
          setMessages(res.data.messages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUserId, setMessages]);

  // Set up socket connection and message listener
  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("join", currentUserId);

    const handleReceiveMessage = (msg) => {
      if (
        (msg.sender === selectedUser?._id ||
          msg.receiver === selectedUser?._id) &&
        !messages.some((m) => m._id === msg._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Cleanup listener on unmount or dependency change
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [currentUserId, selectedUser?._id, messages, setMessages]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await instance.post("/socket/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.url) {
        const fileMsg = {
          sender: currentUserId,
          receiver: selectedUser._id,
          text: "",
          fileUrl: res.data.url,
          fileType: res.data.mimetype,
          fileName: res.data.filename,
          createdAt: new Date().toISOString(),
        };

        socket.emit("sendMessage", fileMsg);
        setMessages((prev) => [...prev, fileMsg]);
      }
    } catch (err) {
      console.error("❌ File upload failed:", err);
    }
  };

  const sendMessage = () => {
    if (text.trim() && selectedUser) {
      const msg = {
        sender: currentUserId,
        receiver: selectedUser._id,
        text,
        createdAt: new Date().toISOString(),
      };

      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setText("");
    }
  };

  const WelcomeScreen = () => (
    <div className="flex items-center justify-center flex-1 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 backdrop-blur-xl">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-6 relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <MdWavingHand className="text-white text-4xl animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-slate-800"></div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-4">
          Welcome back, {user?.name || "User"}!
        </h2>
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Choose a conversation from your contacts to start chatting
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <div className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center shadow-md">
              <BsChatDots className="text-purple-400" />
            </div>
            <span>Instant messaging</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <div className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center shadow-md">
              <RiGalleryLine className="text-pink-400" />
            </div>
            <span>Share photos & docs</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <div className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center shadow-md">
              <FiUsers className="text-green-400" />
            </div>
            <span>Connect with friends</span>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-2xl text-gray-300 shadow-md">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            Select a contact to begin
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 flex flex-col h-full shadow-xl overflow-hidden relative font-sans">
      {selectedUser ? (
        <>
          <div className="p-4 border-b border-gray-700 flex items-center gap-3 bg-gradient-to-r from-[#1a1625] to-[#12101a] shadow-inner">
            <div className="relative">
              {selectedUser?.image ? (
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-[50px] aspect-square rounded-2xl object-cover ring-2 ring-purple-600 shadow-md"
                />
              ) : (
                <div className="w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl ring-2 ring-purple-600 shadow-md">
                  {selectedUser?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">
                {selectedUser.name}
              </h2>
              <p className="text-green-400 text-sm font-semibold">Online</p>
            </div>
          </div>

          <div 
            ref={messagesContainerRef}
            className="flex-1 p-4 pb-34 bg-gradient-to-b from-[#12101a] to-[#0f0d16] overflow-y-auto custom-scrollbar hide-scrollbar"
            style={{ 
              maxHeight: "calc(100% - 140px)", // Adjust based on header and input heights
              overflowY: "auto"
            }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <BsChatDots className="text-5xl mx-auto mb-3 opacity-60" />
                  <p className="text-lg">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((item, index) => {
                  const isSender = item.sender === currentUserId;
                  return (
                    <div
                      key={item._id || index}
                      className={`mb-4 flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-3 py-2 rounded-2xl max-w-xs shadow-lg transition-transform duration-300 hover:shadow-xl ${
                          isSender
                            ? "bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 text-white font-semibold text-lg transform hover:scale-105"
                            : "bg-gray-700 text-white border border-gray-600"
                        }`}
                      >
                        {item.fileUrl ? (
                          item.fileType?.startsWith("image/") ? (
                            <img
                              src={item.fileUrl}
                              alt={item.fileName}
                              className="max-w-[120px] rounded-lg shadow-md"
                            />
                          ) : (
                            <Link
                              to={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-pink-400 font-semibold hover:text-pink-600"
                            >
                              📄 {item.fileName || "Download File"}
                            </Link>
                          )
                        ) : (
                          <span>{item.text}</span>
                        )}
                        <span className="text-xs text-gray-300 block mt-1 text-right select-none">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="absolute bottom-15 left-0 right-0 p-4 border-t border-white/20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md shadow-inner flex gap-4 items-center">
            <div className="flex flex-1 relative">
              <input
                className="w-full p-3 pl-4 pr-12 bg-gray-900 bg-opacity-70 text-white rounded-2xl border border-purple-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                spellCheck="false"
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-pink-700 cursor-pointer transition-colors"
                title="Upload file"
              >
                <RiGalleryLine size={22} />
              </label>
            </div>
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 flex items-center gap-2 rounded-2xl text-white font-semibold shadow-lg transition-transform duration-200 transform hover:scale-105"
              title="Send Message"
            >
              <span>Send</span>
              <LuSendHorizontal />
            </button>
          </div>

          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 7px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          `}</style>
        </>
      ) : (
        <WelcomeScreen />
      )}
    </div>
  );
};

export default ChatContainer;
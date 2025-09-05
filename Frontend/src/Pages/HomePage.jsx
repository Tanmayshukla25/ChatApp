import React, { useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  return (
    <div
      className="bg-[#8185B2]/10 h-[100vh] p-5 text-white max-md:hidden"
     
    >
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
        style={{ maxHeight: "91dvh", width: "100%" }}
      >
        <LeftSideBar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />

        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          messages={messages}
          setMessages={setMessages}
        />

        {selectedUser && (
          <RightSideBar selectedUser={selectedUser} files={messages} />
        )}
      </div>
    </div>
  );
};

export default HomePage;

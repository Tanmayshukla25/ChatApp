import React, { useState } from 'react'
import LeftSideBar from '../components/LeftSideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([]) // ✅ Lifted up state

  return (
    <div className='border w-full h-screen sm:px-[8%] sm:py-[2%]'>
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        {/* Pass selectedUser and setter */}
        <LeftSideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

        {/* Pass messages and setMessages to ChatContainer */}
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          messages={messages}
          setMessages={setMessages}
        />

        {/* Show RightSideBar only if a user is selected */}
        {selectedUser && (
          <RightSideBar selectedUser={selectedUser} files={messages} />
        )}
      </div>
    </div>
  )
}

export default HomePage

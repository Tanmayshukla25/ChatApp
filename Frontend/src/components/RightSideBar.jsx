import React from 'react'

import UserImg from "../assets/Avtarimg.png"
import instance from '../Pages/axiosConfig';
import { useContext } from 'react';
import UserContext from '../Pages/UserContext';
import { Navigate } from 'react-router-dom';

const RightSideBar = ({ selectedUser }) => {
  const { setUser } = useContext(UserContext);
   const handleLogout = async () => {
      try {
        await instance.post("/user/logout", {}, { withCredentials: true });
  
        setUser(null);
  
        Navigate("/login");
      } catch (error) {
        console.error("Logout failed", error);
      }
    };
  if (!selectedUser) {
    return (
      <div className="hidden md:flex items-center justify-center text-gray-400 bg-[#1a1625] min-h-screen w-80">
        Select a user to see profile
      </div>
    )
  }

  return (
    <div className="bg-[#8185B2]/10 text-white p-5 relative min-h-screen w-80">
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={selectedUser?.image || UserImg}
            alt="User"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#1a1625] rounded-full"></div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{selectedUser?.name}</h2>
        <p className="text-sm text-gray-300 mb-1">{selectedUser?.PhoneNumber}</p>
        <p className="text-sm text-gray-300">{selectedUser?.email}</p>
      </div>
      <div className='absolute bottom-21 left-5 right-5'>
        <div className='flex items-center justify-center'>
          <button  onClick={handleLogout} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-full font-medium transition-all duration-200">
            LogOut
          </button>
        </div>
      </div>
    </div>
  )
}

export default RightSideBar
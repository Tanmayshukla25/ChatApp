import React, { useContext, useEffect, useState } from "react";
import Logo from "../assets/chatlogo.png";
import UserImg from "../assets/Avtarimg.png";
import { CiMenuKebab } from "react-icons/ci";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import instance from "../Pages/axiosConfig";
import { Navigate } from "react-router-dom";
import UserContext from "../Pages/UserContext";
import { Link } from "react-router-dom";
const LeftSideBar = ({ selectedUser, setSelectedUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [allUser, setALLUser] = useState([]);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    GetAllUsers();
  }, []);
  async function GetAllUsers() {
    try {
      const response = await instance.get("/user/UserData");
      setALLUser(response.data || []);
    } catch (error) {
      console.error("Error fetching all products for admin:", error);
    }
  }

  const handleLogout = async () => {
    try {
      await instance.post("/user/logout", {}, { withCredentials: true });

      setUser(null);

      Navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuAction = (action) => {
    setIsDropdownOpen(false);

    console.log(`${action} clicked`);
  };

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl  text-white ${
        selectedUser ? "max-mad:hidden" : ""
      }`}
    >
      <div className="w-full p-4 rounded-lg shadow-lg">
        <div className="pb-5">
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center space-x-3">
                <img
                  src={Logo}
                  alt="Logo"
                  className="max-w-10 h-auto transition-transform duration-200 hover:scale-105"
                />
              </div>
              <div>
                <h1>ChatApp</h1>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Menu options"
              >
                <CiMenuKebab className="w-5 h-5 text-white/80 hover:text-white transition-colors duration-200" />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  <div className="absolute top-full right-0 z-20 w-48 mt-2 bg-[#1e1a2e] border border-gray-600/50 rounded-lg shadow-xl backdrop-blur-sm">
                    <div className="py-2">
                      <button
                        onClick={() => handleMenuAction("profile")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150 flex items-center space-x-3"
                      >
                        <FiUser className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        onClick={() => handleMenuAction("settings")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150 flex items-center space-x-3"
                      >
                        <FiSettings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>

                      <hr className="my-1 border-gray-600/50" />

                      <button
                        onClick={() => handleMenuAction("logout")}
                        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-800 transition-colors duration-150 flex items-center space-x-3"
                      >
                        <FiLogOut className="w-5 h-5" />
                        <button onClick={handleLogout}>
                          <div className="flex justify-center items-center gap-2">
                            <span className=" text-white " title="Logout">
                              Logout
                            </span>
                          </div>
                        </button>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center bg-[#282142] rounded-full  gap-2 py-3 px-4 mt-5 shadow-2xl">
            <FiSearch />
            <input
              type="text"
              placeholder="Search User..."
              className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1 "
            />
          </div>
        </div>

        <div className="flex flex-col">
          {allUser.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedUser(item)}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded-2xl cursor-pointer max-sm:text-sm ${
                selectedUser?._id === item._id && "bg-[#282142]/50"
              }`}
            >
              <img
                src={item?.image || UserImg}
                alt=""
                className="w-[45px] aspect-[1/1] rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;

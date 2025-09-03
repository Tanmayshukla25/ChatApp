import React, { useContext, useEffect, useState } from "react";
import Logo from "../assets/chatLogo.png";
import UserImg from "../assets/Avtarimg.png";
import { CiMenuKebab } from "react-icons/ci";
import { FiUser, FiLogOut } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { User, Mail, Phone, Lock, Upload, UserCheck, X } from "lucide-react";
import instance from "../Pages/axiosConfig";
import { useNavigate } from "react-router-dom";
import UserContext from "../Pages/UserContext";

const LeftSideBar = ({ selectedUser, setSelectedUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allUser, setALLUser] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    GetAllUsers();
  }, []);

  async function GetAllUsers() {
    try {
      const response = await instance.get("/user/UserData");
      setALLUser(response.data || []);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  }

  const handleLogout = async () => {
    try {
      await instance.post("/user/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const currentUser = allUser.find((item) => item._id === user?._id);

  const handleMenuAction = (action) => {
    setIsDropdownOpen(false);
    if (action === "profile" && currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        password: "",
        phoneNumber: currentUser.PhoneNumber || "",
      });
      setPreviewUrl(currentUser.image || null);
      setIsEditProfile(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(currentUser?.image || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("PhoneNumber", formData.phoneNumber);
      if (image) data.append("image", image);

      await instance.put(`/user/update/${user?._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsLogin(true);
      setFailed(false);
      setIsEditProfile(false);
      GetAllUsers();
    } catch (error) {
      setIsLogin(false);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUser.filter(
    (item) =>
      item._id !== user?._id &&
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>
        {`
          @keyframes scale-up-center {
            0% { 
              transform: scale(0.1); 
              opacity: 0;
            } 
            100% { 
              transform: scale(1);
              opacity: 1;
            }
          }

          .scale-up-center-normal { 
            animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) 0s 1 normal both;     
          }
        `}
      </style>

      <div
        className={`bg-[#8185B2]/10 h-full p-5 text-white ${
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
                >
                  <CiMenuKebab className="w-5 h-5 text-white/80 hover:text-white transition-colors duration-200" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute top-full right-0 z-20 w-60 mt-2 bg-[#1e1a2e] border border-gray-600/50 rounded-lg shadow-xl backdrop-blur-sm p-3">
                      {currentUser && (
                        <div className="flex items-center gap-3 p-2 border-b border-gray-600/50">
                          <img
                            src={currentUser.image || UserImg}
                            alt="CurrentUser"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">
                              {currentUser.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {currentUser.PhoneNumber}
                            </span>
                            <span className="text-xs text-gray-400">
                              {currentUser.email}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="py-2">
                        <button
                          onClick={() => handleMenuAction("profile")}
                          className="w-full px-4 py-3 text-left text-sm text-gray-200 hover:bg-white/10 transition-colors duration-150 flex items-center space-x-3"
                        >
                          <FiUser className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>

                        <hr className="my-1 border-gray-600/50" />

                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-800 transition-colors duration-150 flex items-center space-x-3"
                        >
                          <FiLogOut className="w-5 h-5" />
                          <span className="text-white">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center bg-[#282142] rounded-full gap-2 py-3 px-4 mt-5 shadow-2xl">
              <FiSearch />
              <input
                type="text"
                placeholder="Search User..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
              />
            </div>
          </div>

          {isEditProfile ? (
            <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20 p-8 rounded-3xl space-y-6 w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar scale-up-center-normal relative">
                <button
                  onClick={() => setIsEditProfile(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Update Profile
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Keep your information up to date
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border-4 border-white shadow-lg overflow-hidden">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-600 transition-colors">
                      <Upload className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {isLogin && (
                    <div className="flex items-center justify-center mb-6 animate-bounce">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-center py-3 px-6 rounded-2xl text-white shadow-lg">
                        <div className="flex items-center gap-3">
                          <SiTicktick className="text-xl" />
                          <h1 className="font-semibold">Login Successful!</h1>
                        </div>
                      </div>
                    </div>
                  )}

                
                  {failed && (
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-center py-3 px-6 rounded-2xl text-white shadow-lg">
                        <h1 className="font-semibold">Login Failed</h1>
                      </div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center space-x-3 bg-blue-50 py-3 px-6 rounded-2xl">
                        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-700 font-medium">
                          Signing you in...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-lg mx-auto">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white text-gray-900"
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white text-gray-900"
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white text-gray-900"
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        placeholder="New Password (optional)"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white text-gray-900"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditProfile(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          "Update Profile"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedUser(item)}
                    className={`relative flex items-center gap-2 p-2 pl-4 rounded-2xl cursor-pointer max-sm:text-sm ${
                      selectedUser?._id === item._id && "bg-[#282142]/50"
                    }`}
                  >
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[45px] aspect-[1/1] rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-[45px] h-[45px] rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                        {item?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    <div className="flex flex-col leading-5">
                      <p>{item.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  No users found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;

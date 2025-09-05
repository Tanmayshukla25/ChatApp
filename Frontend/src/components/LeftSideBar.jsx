import React, { useContext, useEffect, useState } from "react";
import Logo from "../assets/chatLogo.png";
import UserImg from "../assets/Avtarimg.png";
import { CiMenuKebab } from "react-icons/ci";
import { FiUser, FiLogOut } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import {
  User,
  Mail,
  Phone,
  Lock,
  Upload,
  UserCheck,
  X,
  CheckCircle,
} from "lucide-react";
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
      <div
        className={`relative h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 backdrop-blur-xl border-r border-white/10 text-white overflow-hidden ${
          selectedUser ? "max-mad:hidden" : ""
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header Section */}
          <div className="relative z-50 p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              {/* Logo Section */}
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="w-12 h-12 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    ChatApp
                  </h1>
                </div>
              </div>

              {/* Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 group"
                >
                  <CiMenuKebab className="w-5 h-5 text-white/80 group-hover:text-white transition-all duration-200 group-hover:scale-110" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute top-full right-0 z-20 w-72 mt-3 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                      {/* User Info Section */}
                      {currentUser && (
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={currentUser.image || UserImg}
                                alt="CurrentUser"
                                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20"
                              />
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white truncate text-lg">
                                {currentUser.name}
                              </h3>
                              <p className="text-white/60 text-sm truncate">
                                {currentUser.PhoneNumber}
                              </p>
                              <p className="text-white/60 text-sm truncate">
                                {currentUser.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Menu Options */}
                      <div className="p-2">
                        <button
                          onClick={() => handleMenuAction("profile")}
                          className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-4 rounded-xl group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium">Edit Profile</span>
                        </button>

                        <div className="my-2 border-t border-white/10"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-white hover:bg-red-500/20 transition-all duration-200 flex items-center gap-4 rounded-xl group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <FiLogOut className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="w-5 h-5 text-white/40" />
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Edit Profile Modal */}
          {isEditProfile && (
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
          )}

          {/* Users List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedUser(item)}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group hover:bg-white/10 ${
                    selectedUser?._id === item._id
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="relative">
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 group-hover:scale-105 shadow-lg">
                        {item?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors duration-200 truncate text-lg">
                      {item.name}
                    </h3>
                    <p className="text-white/60 text-sm">
                      Click to start conversation
                    </p>
                  </div>

                  {selectedUser?._id === item._id && (
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                  <FiSearch className="w-10 h-10 text-white/40" />
                </div>
                <div>
                  <p className="text-white/60 font-medium text-lg">
                    No users found
                  </p>
                  <p className="text-white/40 text-sm mt-1">
                    {searchTerm
                      ? "Try a different search term"
                      : "Start by searching for users"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
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
            animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1)
              0s 1 normal both;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    </>
  );
};

export default LeftSideBar;

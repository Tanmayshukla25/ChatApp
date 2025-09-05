import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../Pages/axiosConfig";
import UserContext from "../Pages/UserContext";

const RightSideBar = ({ selectedUser, files = [] }) => {
  const { setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("Media");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await instance.post("/user/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="hidden md:flex items-center justify-center min-h-screen w-80 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 backdrop-blur-xl border-l border-white/10">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-white/10 mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-white/60 font-medium">Select a user to see profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 backdrop-blur-xl border-l border-white/10 text-white flex flex-col overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* User Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6 group">
            {selectedUser?.image ? (
              <div className="relative">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/10 group-hover:ring-white/20 transition-all duration-300 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white/10 group-hover:ring-white/20 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                {selectedUser?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            {/* Online Status */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 border-4 border-slate-900 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {selectedUser?.name}
            </h2>
            <div className="space-y-1">
              <p className="text-white/70 text-sm font-medium flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {selectedUser?.PhoneNumber}
              </p>
              <p className="text-white/70 text-sm font-medium flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {selectedUser?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/10 shadow-lg">
            <div className="flex gap-1">
              {["Media", "Docs"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {activeTab === tab && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab === "Media" ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {tab}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {files.length > 0 ? (
              files
                .filter((item) =>
                  activeTab === "Media"
                    ? item.fileType?.startsWith("image/")
                    : !item.fileType?.startsWith("image/")
                )
                .map((item, index) => (
                  <div key={index} className="group">
                    {item.fileType?.startsWith("image/") ? (
                      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                        <img
                          src={item.fileUrl}
                          alt={item.fileName}
                          className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white text-xs font-medium truncate">{item.fileName}</p>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{item.fileName || "File"}</p>
                            <p className="text-white/50 text-xs">Document</p>
                          </div>
                          <svg className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </Link>
                    )}
                  </div>
                ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  {activeTab === "Media" ? (
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <p className="text-white/60 font-medium">No {activeTab.toLowerCase()} found</p>
                <p className="text-white/40 text-sm mt-1">Files will appear here when shared</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Logout Button */}
        <div className="mt-6 pt-6 border-t fixed bottom-18 w-[85%] border-white/10">
          <button
            onClick={handleLogout}
            className="w-full relative  overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
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
  );
};

export default RightSideBar;
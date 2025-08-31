import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import instance from "./axiosConfig.js";

import { useContext } from "react";
import UserContext from "./UserContext";

import { SiTicktick } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [failed, setFailed] = useState(false);
const {fetchData} = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("referer") || "/";
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await instance.post(
        "/user/login",
        { email, password },
        { withCredentials: true }
      );

      setEmail("");
      setPassword("");

      setIsLogin(true);
      setFailed(false);
      fetchData();
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !/^[\w.+/-]+@gmail\.com$/.test(value)) {
      setError("Please enter a valid Gmail address (e.g., example@gmail.com)");
    } else {
      setError("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <ToastContainer />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center shadow-2xl">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-lg">Sign in to continue your journey</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-1.5 mb-8 border border-white/20">
          <div className="flex-1 text-center py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg transform transition-all duration-200">
            Sign In
          </div>
          <Link
            to="/register"
            className="flex-1 text-center py-3 px-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
          >
            Register
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
          {/* Success notification */}
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

          {/* Error notification */}
          {failed && (
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-center py-3 px-6 rounded-2xl text-white shadow-lg">
                <h1 className="font-semibold">Login Failed</h1>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3 bg-blue-50 py-3 px-6 rounded-2xl">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-700 font-medium">Signing you in...</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 transition-opacity duration-300 focus-within:opacity-100"></div>
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg border border-red-200">
                  {error}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 hover:shadow-xl active:scale-95"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div className="flex justify-center mb-6">
            <Link
              to={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
              className="flex items-center justify-center w-14 h-14 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-3 group"
              title="Sign in with Google"
            >
              <FcGoogle className="text-2xl group-hover:scale-110 transition-transform duration-200" />
            </Link>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-purple-600 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
      
      </div>
    </div>
  );
}

export default LoginPage;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import SEModal from "../components/se-modal";
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// API
import { login, google } from "../../api/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  // Check if user already logged in
  useEffect(() => {
    const cachedUser = JSON.parse(localStorage.getItem("user"));
    if (cachedUser && cachedUser.token && cachedUser.user_id) {
      navigate("/home");
    }
  }, []);

  // Form Submit
  const [formData, setFormData] = useState({
    email_or_username: "",
    password: "",
  });

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData);
    setIsLoading(false);

    if (result.status === "success") {
      localStorage.setItem("user", JSON.stringify({
        user_id: result.user_id,
        token: result.token
      }));
      console.log(result);

      setModal({
        show: true,
        title: "Login Successful 🎉",
        message: result.message,
      });

      setTimeout(() => {
        setModal({ show: false, title: "", message: "" });
        navigate("/home");
      }, 1500);
    } else {
      setModal({
        show: true,
        title: "Login Failed ❌",
        message: result.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white overflow-hidden">
        {/* Logo and Heading */}
        <div className="text-center p-8 bg-white">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl opacity-20 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Rant on Me
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back to your space
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" /> Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="email_or_username"
                  required
                  value={formData.email_or_username}
                  onChange={handleChange}
                  placeholder="Enter your email or username"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                    focusedField === "email"
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-500" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none pr-10 transition-all duration-200 ${
                    focusedField === "password"
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                
              </label>
              <Link
                to="/forgot"
                className="text-orange-500 hover:text-orange-600 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium rounded-lg hover:from-orange-500 hover:to-orange-400 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const decoded = jwtDecode(credentialResponse.credential);
                const result = await google({ idToken: credentialResponse.credential });

                if (result.status === "success") {
                  localStorage.setItem("user", JSON.stringify({
                    user_id: result.user_id,
                    token: result.token
                  }));

                  setModal({
                    show: true,
                    title: "Login Successful 🎉",
                    message: result.message,
                  });

                  setTimeout(() => {
                    setModal({ show: false, title: "", message: "" });
                    navigate("/home");
                  }, 1500);
                } else {
                  setModal({
                    show: true,
                    title: "Login Failed ❌",
                    message: result.message,
                  });
                }
              } catch (error) {
                console.error("Google Sign-In error:", error);
                setModal({
                  show: true,
                  title: "Login Failed ❌",
                  message: "Failed to authenticate with Google.",
                });
              }
            }}
            onError={() =>
              setModal({
                show: true,
                title: "Google Sign-In Error ❌",
                message: "Google sign-in failed. Please try again.",
              })
            }
          />

          {/* Switch View */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors"
            >
              Create one now
            </Link>
          </p>

          {/* Modal Popup */}
          <SEModal
            show={modal.show}
            title={modal.title}
            message={modal.message}
            onClose={() => setModal({ show: false, title: "", message: "" })}
          />
        </div>
      </div>
    </div>
  );
}
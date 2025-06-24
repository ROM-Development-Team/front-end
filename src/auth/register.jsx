import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import SEModal from "../components/se-modal";
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// API
import { register, google } from "../../api/auth";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  // Form Submit
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
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

    const result = await register(formData);
    setIsLoading(false);

    if (result.status === "success") {
      setModal({
        show: true,
        title: "Registered Successfully 🎉",
        message: result.message,
      });

      setTimeout(() => {
        setModal({ show: false, title: "", message: "" });
        navigate("/");
      }, 1500);
    } else {
      setModal({
        show: true,
        title: "Registration Failed ❌",
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
            Join Rant On Me
          </h1>
          <p className="text-gray-600 mt-2">
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" /> First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                    focusedField === "first_name"
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onFocus={() => setFocusedField("first_name")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" /> Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                    focusedField === "last_name"
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onFocus={() => setFocusedField("last_name")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" /> Username
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                  focusedField === "username"
                    ? "border-orange-500 ring-2 ring-orange-100"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" /> Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                  focusedField === "email"
                    ? "border-orange-500 ring-2 ring-orange-100"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
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
                  placeholder="Create a password"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium rounded-lg hover:from-orange-500 hover:to-orange-400 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign Up <ArrowRight className="w-4 h-4" />
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
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Sign Up */}
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
            Already have an account?{" "}
            <Link
              to="/"
              className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors"
            >
              Sign in instead
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
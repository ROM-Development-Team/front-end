import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowRight, Sparkles } from "lucide-react";
import SEModal from "../components/se-modal";

// API
import { resetPassword } from "../../api/auth";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (tokenParam && emailParam) {
      setFormData((prev) => ({
        ...prev,
        token: tokenParam,
        email: emailParam
      }));
    }
  }, [location.search]);

  // Form Submit
  const [formData, setFormData] = useState({
    token: "",
    email: "",
    new_password: "",
    confirm_password: ""
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

    const result = await resetPassword(formData);
    setIsLoading(false);

    if (result.status === "success") {
      setModal({
        show: true,
        title: "Password Reset Successfully! 🎉",
        message: result.message,
      });

      setTimeout(() => {
        setModal({ show: false, title: "", message: "" });
        navigate("/");
      }, 1500);
    } else {
      setModal({
        show: true,
        title: "Password Reset Failed ❌",
        message: result.message,
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Reset Password
          </h2>
          <p className="text-gray-600 mt-2">
            Create a new password for your account
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          {message ? (
            <div className={`p-4 mb-6 rounded-lg text-sm ${
              message.includes("successfully") 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }`}>
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-500" /> New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  name="new_password"
                  required
                  value={formData.new_password}
                  onChange={handleChange}
                  minLength="8"
                  placeholder="Enter new password"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none pr-10 transition-all duration-200 ${
                    focusedField === "new_password"
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onFocus={() => setFocusedField("new_password")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                >
                  {showPassword.newPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-500" /> Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirm_password"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  minLength="8"
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none pr-10 transition-all duration-200 ${
                    focusedField === "confirm_password"
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onFocus={() => setFocusedField("confirm_password")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
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
                  Resetting password...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Reset Password <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Back to login */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Remember your password?{" "}
            <Link
              to="/"
              className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors"
            >
              Sign in here
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
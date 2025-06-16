import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import SEModal from "../components/se-modal";

// API
import { forgotPassword } from "../../api/auth";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  // Form Submit
  const [formData, setFormData] = useState({
    email: ""
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

    const result = await forgotPassword(formData);
    setIsLoading(false);

    if (result.status === "success") {
      setModal({
        show: true,
        title: "Password Reset Link Sent! 🎉",
        message: result.message,
      });

      setTimeout(() => {
        setModal({ show: false, title: "", message: "" });
        navigate("/");
      }, 1500);
    } else {
      setModal({
        show: true,
        title: "Password Reset Link Failed ❌",
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
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Forgot password?
          </h2>
          <p className="text-gray-600 mt-2">
            Enter your email to reset your password
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          {message ? (
            <div className="p-4 mb-6 bg-green-50 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" /> Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                    Sending reset link...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send Reset Link <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>
          )}

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
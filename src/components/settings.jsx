import { useState } from "react";
import { X, Trash2, Shield, Bell, UserX, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./modal";

const SettingsSidebar = ({ show, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const settingsItems = [
    { icon: User, label: "Profile Settings", to: "/profile" },
    // { icon: Shield, label: "Privacy Settings", to: "/settings/privacy", status: "development" },
    // { icon: Bell, label: "Notification Preferences", to: "/settings/notifications", status: "development" },
    // { icon: UserX, label: "Blocked Users", to: "/settings/blocked", status: "development" },
    // { icon: Trash2, label: "Delete Account", to: "/settings/delete", danger: true, status: "development" },
    { icon: LogOut, label: "Log Out", to: "/", danger: true },
  ];

  const navItems = [
    { emoji: "🌡️", label: "Emotional Thermometer", to: "/thermometer", status: "new" },
    { emoji: "📨", label: "Rants Received", to: "/rants", status: "new" },
    { emoji: "🕳️", label: "Send to Void", to: "/void", status: "new" },
    { emoji: "🤖", label: "Rant AI", to: "/rant", status: "new" },
    { emoji: "🗣️", label: "Rant Voice AI", to: "/voice", status: "new" }
    // { emoji: "📁", label: "Saved / Bookmarked Rants", to: "/saved", status: "development" },
    // { emoji: "🎙️", label: "Voice Rants", to: "/voice", status: "development" },
    // { emoji: "💬", label: "Chat / Messages", to: "/chat", status: "development" },
    // { emoji: "🔐", label: "Whispers (Private Threads)", to: "/whispers", status: "development" },
    // { emoji: "📅", label: "Time Capsule", to: "/time-capsule", status: "development" },
    // { emoji: "📈", label: "Rant Analytics", to: "/analytics", status: "development" },
  ];

  const handleClick = (item) => {
    if (item.label === "Log Out") {
      localStorage.removeItem("user"); 
      navigate("/");                  
      onClose();                       
      return;
    }
    if (item.status === "development") {
      setModalMessage(`${item.label} is currently under development. Coming soon!`);
      setShowModal(true);
    } else {
      navigate(item.to);
      onClose();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return <span className="text-[10px] text-green-600">NEW</span>;
      case "working":
        return <span className="text-[10px] text-blue-600">✓</span>;
      case "development":
        return <span className="text-[10px] text-gray-500">⌛</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 flex justify-end"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-80 bg-white h-full shadow-xl p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Settings & Features</h2>
                <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Account Settings</h4>
                <div className="space-y-2">
                  {settingsItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(item)}
                      className={`w-full flex items-start justify-between gap-3 p-3 rounded-xl transition ${
                        item.danger
                          ? "hover:bg-red-50"
                          : "hover:bg-orange-50"
                      } ${item.status === "development" ? "opacity-70" : ""}`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-9 h-9 flex items-center justify-center rounded-md ${
                            item.danger ? "bg-red-100" : "bg-orange-100"
                          } ${item.status === "development" ? "opacity-70" : ""}`}
                        >
                          <item.icon
                            size={16}
                            className={item.danger ? "text-red-600" : "text-orange-600"}
                          />
                        </div>
                        <div className="text-left">
                          <p
                            className={`font-medium ${
                              item.danger ? "text-red-600" : "text-gray-800"
                            }`}
                          >
                            {item.label}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getStatusBadge(item.status)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 mt-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Features</h4>
                <div className="space-y-2">
                  {navItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(item)}
                      className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-orange-50 transition ${
                        item.status === "development" ? "opacity-70" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-9 h-9 flex items-center justify-center bg-orange-100 rounded-md text-sm ${
                          item.status === "development" ? "opacity-70" : ""
                        }`}>
                          {item.emoji}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-800">{item.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getStatusBadge(item.status)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal show={showModal} onClose={() => setShowModal(false)} message={modalMessage} />
    </>
  );
};

export default SettingsSidebar;
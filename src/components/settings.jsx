import { useState } from "react";
import { X, Trash2, Shield, Bell, UserX, Lock, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./modal";

const SettingsSidebar = ({ show, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const settingsItems = [
    { icon: Lock, label: "Account Settings", to: "/profile" },
    { icon: Shield, label: "Privacy Settings", to: "/settings/privacy", disabled: true },
    { icon: Bell, label: "Notification Preferences", to: "/settings/notifications", disabled: true },
    { icon: UserX, label: "Blocked Users", to: "/settings/blocked", disabled: true },
    { icon: Trash2, label: "Delete Account", to: "/settings/delete", danger: true, disabled: true },
    { icon: LogOut, label: "Log Out", to: "/", danger: true },
  ];

  const navItems = [
    { emoji: "📁", label: "Saved / Bookmarked Rants", to: "/saved", disabled: true },
    { emoji: "📨", label: "Anonymous Inbox / Rants Received", to: "/inbox", disabled: true },
    { emoji: "📊", label: "Emotional Trends", to: "/trends", disabled: true },
    { emoji: "🎙️", label: "Voice Rants", to: "/voice", disabled: true },
    { emoji: "💬", label: "Chat / Messages", to: "/chat", disabled: true },
    { emoji: "🔐", label: "Whispers (Private Threads)", to: "/whispers", disabled: true },
    { emoji: "📅", label: "Time Capsule", to: "/time-capsule", disabled: true },
    { emoji: "📈", label: "Rant Analytics", to: "/analytics", disabled: true },
  ];

  const handleClick = (item) => {
    if (item.label === "Log Out") {
      localStorage.removeItem("user"); 
      navigate("/");                  
      onClose();                       
      return;
    }
    if (item.disabled) {
      setModalMessage(`${item.label} is currently in development.`);
      setShowModal(true);
    } else {
      navigate(item.to);
      onClose();
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
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition ${
                        item.danger
                          ? "hover:bg-red-50"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 flex items-center justify-center rounded-md ${
                          item.danger ? "bg-red-100" : "bg-orange-100"
                        }`}
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
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 mt-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Navigation</h4>
                <div className="space-y-2">
                  {navItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition"
                    >
                      <div className="w-9 h-9 flex items-center justify-center bg-orange-100 rounded-md text-sm">
                        {item.emoji}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{item.label}</p>
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

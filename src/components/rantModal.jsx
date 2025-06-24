import { useState, useEffect } from "react";
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Heart,
  Reply,
  Share, 
  MoreVertical,
  Bookmark,
  Trash2,
  MapPin,
  Flag,
  Clock,
  X
} from "lucide-react";
import { updateRantInbox, deleteRantInbox } from "../../api/rantInbox";
import SEModal from "./se-modal";

const RantViewModal = ({ rant, onClose, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [wasViewed, setWasViewed] = useState(rant?.read || false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (rant && !rant.read) {
      markAsRead();
    }
  }, [rant]);

  const markAsRead = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
        
    if (!user || !user.user_id || !user.token) {
      console.error("User authentication data not found");
      return;
    }

    try {
      const result = await updateRantInbox(
        rant.rant_id,
        user.user_id,
        user.token
      );
      
      if (result.status === 'success') {
        setWasViewed(true); // Update local state
      }
    } catch (error) {
      console.error('Error marking rant as read:', error);
    }
  };

  const handleDelete = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.user_id || !user.token) {
      showMessage('Error', "User authentication data not found");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteRantInbox(
        rant.rant_id,
        user.user_id,
        user.token
      );
      
      if (result.status === 'success') {
        showMessage('Success', "Rant deleted successfully");
        onDelete(rant.id);
        setTimeout(() => {
          onClose();
          setShowModal(false);
        }, 1500);
      } else {
        showMessage('Error', result.message || "Failed to delete rant");
      }
    } catch (error) {
      showMessage('Error', error.message || "An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  const showMessage = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };
  
  const getDeviceIcon = (deviceType) => {
    switch ((deviceType || "").toLowerCase()) {
      case "mobile": return "📱";
      case "desktop": return "💻";
      case "tablet": return "📱";
      default: return "🖥️";
    }
  };

  const getBrowserIcon = (browser) => {
    switch ((browser || "").toLowerCase()) {
      case "chrome": return "🌐";
      case "safari": return "🧭";
      case "firefox": return "🦊";
      case "edge": return "🔷";
      default: return "🌐";
    }
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch (action) {
      case 'delete':
        handleDelete();
        break;
      case 'report':
        console.log('Reporting rant:', rant.id);
        break;
      case 'bookmark':
        console.log('Bookmarking rant:', rant.id);
        break;
      case 'locate':
        console.log('Locating rant:', rant.id);
        break;
      default:
        console.log(`Action: ${action} for rant ${rant.id}`);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp?._seconds) return "Just now";
    const date = new Date(timestamp._seconds * 1000);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)} hour${diff > 7200 ? 's' : ''} ago`;
    if (diff < 2592000) return `${Math.floor(diff/86400)} day${diff > 172800 ? 's' : ''} ago`;
    if (diff < 31536000) return `${Math.floor(diff/2592000)} month${diff > 5184000 ? 's' : ''} ago`;
    return `${Math.floor(diff/31536000)} year${diff > 63072000 ? 's' : ''} ago`;
  };

  const handleShareToFacebook = async () => {
    setIsSharing(true);
    try {
      // 1. Create container with emoji-themed styling
      const shareContainer = document.createElement('div');
      Object.assign(shareContainer.style, {
        position: 'fixed',
        left: '-10000px',
        width: '380px', // Compact width for better emoji balance
        background: 'linear-gradient(to bottom right, #fff, #fff9f5)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 15px 40px rgba(249, 115, 22, 0.15)',
        fontFamily: '"Inter", -apple-system, sans-serif',
        border: '1px solid rgba(255, 237, 213, 0.5)'
      });

      // 2. Header with emoji decorations
      const header = document.createElement('div');
      Object.assign(header.style, {
        padding: '24px 24px 12px',
        textAlign: 'center',
        position: 'relative',
        background: 'linear-gradient(to right, #fff7ed, #fff)'
      });

      // Emoji background elements (subtle and modern)
      const createEmojiElement = (emoji, size, x, y, rotate) => {
        const el = document.createElement('div');
        Object.assign(el.style, {
          position: 'absolute',
          fontSize: `${size}px`,
          opacity: '0.15',
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          zIndex: '0',
          pointerEvents: 'none'
        });
        el.textContent = emoji;
        return el;
      }

      // Add decorative emojis (orange-themed)
      header.appendChild(createEmojiElement('🔥', 40, 15, 30, -10));
      header.appendChild(createEmojiElement('💬', 50, 85, 70, 5));
      header.appendChild(createEmojiElement('✨', 30, 50, -10, 15));

      // 3. Perfectly centered logo (smaller size)
      const logo = document.createElement('img');
      logo.src = '/logo.png';
      Object.assign(logo.style, {
        width: '44px',
        height: '44px',
        display: 'block',
        margin: '0 auto 8px',
        filter: 'drop-shadow(0 2px 4px rgba(249, 115, 22, 0.2))'
      });

      // 4. App name with emoji accent
      const appName = document.createElement('div');
      Object.assign(appName.style, {
        color: '#f97316',
        fontSize: '18px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      });
      appName.innerHTML = `Rant on Me <span style="font-size:20px">💭</span>`;

      // 5. Message card with emoji reaction bar
      const messageBox = document.createElement('div');
      Object.assign(messageBox.style, {
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '28px',
        margin: '16px',
        borderRadius: '16px',
        color: '#1a1a1a',
        fontSize: '18px',
        lineHeight: '1.6',
        textAlign: 'center',
        boxShadow: '0 5px 15px rgba(249, 115, 22, 0.08)',
        border: '1px solid rgba(249, 115, 22, 0.1)',
        position: 'relative'
      });
      messageBox.textContent = rant.rant_text;

      // Emoji reaction bar (simulated interactive element)
      const emojiReactions = document.createElement('div');
      Object.assign(emojiReactions.style, {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '20px',
        opacity: '0.8'
      });
      ['❤️', '😂', '😮', '😢', '🔥'].forEach(emoji => {
        const btn = document.createElement('div');
        btn.textContent = emoji;
        btn.style.fontSize = '22px';
        btn.style.cursor = 'pointer';
        btn.style.transform = 'scale(1)';
        btn.style.transition = 'transform 0.2s';
        emojiReactions.appendChild(btn);
      });
      messageBox.appendChild(emojiReactions);

      // 6. Footer with emoji CTA
      const footer = document.createElement('div');
      Object.assign(footer.style, {
        padding: '16px',
        color: '#f97316',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        background: 'rgba(255, 247, 237, 0.6)'
      });
      footer.innerHTML = `Try it now !`;

      // Build structure
      header.appendChild(logo);
      header.appendChild(appName);
      shareContainer.appendChild(header);
      shareContainer.appendChild(messageBox);
      shareContainer.appendChild(footer);
      document.body.appendChild(shareContainer);

      // 7. Capture with emoji enhancements
      const canvas = await html2canvas(shareContainer, {
        scale: 3,
        logging: false,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'rant-emoji.png', { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Fun message from Rant App!',
          text: 'Check out this message with reactions 👀'
        });
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'rant-message.png';
        link.click();
        showMessage('Ready to Share', 'Your emoji-enhanced image is saved!');
      }

    } catch (err) {
      console.error("Sharing failed", err);
      showMessage('Error', 'Couldn\'t create share image. Try again later.');
    } finally {
      setIsSharing(false);
      const containers = document.querySelectorAll('div[style*="left: -10000px"]');
      containers.forEach(c => c.remove());
    }
  };

  if (!rant) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <SEModal 
            show={showModal}
            onClose={() => setShowModal(false)}
            title={modalTitle}
            message={modalMessage}
          />

          <div className="p-6" id="rant-share">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💬</span>
                <div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium border bg-orange-100 text-orange-800 border-orange-200">
                    Anonymous Message
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    disabled={isDeleting}
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </motion.button>
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-10"
                      >
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMenuAction('report')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                        >
                          <Flag size={14} className="mr-2" /> Report
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMenuAction('bookmark')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                        >
                          <Bookmark size={14} className="mr-2" /> Bookmark
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMenuAction('delete')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-500 flex items-center"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            'Deleting...'
                          ) : (
                            <>
                              <Trash2 size={14} className="mr-2" /> Delete
                            </>
                          )}
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMenuAction('locate')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                        >
                          <MapPin size={14} className="mr-2" /> Locate
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  disabled={isDeleting}
                >
                  <X size={20} className="text-gray-600" />
                </motion.button>
              </div>
            </div>

            {rant.media && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                <img
                  src={rant.media || "/placeholder.svg"}
                  alt="Message attachment"
                  className="w-full rounded-xl object-cover max-h-64"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-6"
            >
              <p className="text-gray-800 leading-relaxed text-lg">{rant.rant_text}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-xl p-4 mb-6"
            >
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Device Information</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Device Type</span>
                  <div className="flex items-center space-x-2">
                    <span>{getDeviceIcon(rant.device_info?.device_type)}</span>
                    <span className="text-sm font-medium text-gray-800">{rant.device_info?.device_type || 'Unknown'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Operating System</span>
                  <span className="text-sm font-medium text-gray-800">{rant.device_info?.os || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Browser</span>
                  <div className="flex items-center space-x-2">
                    <span>{getBrowserIcon(rant.device_info?.browser)}</span>
                    <span className="text-sm font-medium text-gray-800">{rant.device_info?.browser || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{formatTimestamp(rant.created_at) || 'Unknown time'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{rant.reactions || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Read
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex space-x-3"
            >
              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Reply size={16} />
                <span>Reply</span>
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleShareToFacebook}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                {isSharing ? (
                  <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Share size={16} className="text-gray-600" />
                )}
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                <Flag size={16} className="text-gray-600" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RantViewModal;
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPermissionPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const permission = Notification.permission;
    const hasDeniedBefore = localStorage.getItem('notif_denied');

    if (permission === 'denied' && !hasDeniedBefore) {
      // Delay so it doesn't instantly show
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleRemindLater = () => {
    // Hide prompt without saving flag
    setShowPrompt(false);
  };

  const handleGuideUser = () => {
    // Save flag to not show again until next session
    localStorage.setItem('notif_denied', 'true');
    setShowPrompt(false);

    alert(
      'You have previously blocked notifications.\n\nTo enable them:\n- Open your browser settings\n- Go to Site settings\n- Find "Notifications" and allow them for this site.'
    );
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#ff8904] text-white px-4 py-3 rounded-xl shadow-lg z-50"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm">
              <p className="font-semibold text-white">Turn On Notifications</p>
              <p className="text-white">
                You blocked notifications. To receive rants and updates, enable them in your browser settings.
              </p>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={handleRemindLater}
                className="text-white bg-[#f54a00] hover:bg-opacity-80 px-3 py-1 rounded-md text-sm"
              >
                Later
              </button>
              <button
                onClick={handleGuideUser}
                className="text-white border border-white hover:bg-white hover:text-[#ff8904] px-3 py-1 rounded-md text-sm transition"
              >
                How to Enable
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPermissionPrompt;

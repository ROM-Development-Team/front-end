import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setFeedback({ type: 'success', message: 'App installed! Ready to rant 🔥' });
    } else {
      setFeedback({ type: 'error', message: 'Maybe later. Rant space still here for you.' });
    }

    setShowModal(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Install Prompt Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl p-4 sm:p-6 z-50 rounded-t-2xl"
          >
            <h2 className="text-lg font-semibold text-gray-800">Install Rant On Me</h2>
            <p className="text-sm text-gray-600 mt-1">
              Add Rant On Me to your home screen for faster access, offline support, and a better experience.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Maybe Later
              </button>
              <button
                onClick={handleInstall}
                className="px-4 py-2 text-sm bg-[#ff8904] hover:bg-[#f54a00] text-white rounded-md shadow-sm transition"
              >
                Install Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-24 right-4 px-4 py-2 rounded-lg shadow-md text-sm font-medium z-50 ${
              feedback.type === 'success'
                ? 'bg-[#ff8904] text-white'
                : 'bg-[#f54a00] text-white'
            }`}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPrompt;

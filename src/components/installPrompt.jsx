import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if user is on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    
    // Check if app is already installed (standalone mode)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show prompt if not iOS and not already installed
      if (!isIOS && !isStandalone) {
        setShowModal(true);
      }
    };

    // For non-iOS devices that support beforeinstallprompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS - show install instructions after a delay if not standalone
    const timer = setTimeout(() => {
      if (isIOS && !isStandalone && !showModal) {
        setShowModal(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [isIOS, isStandalone]);

  const handleInstall = async () => {
    if (isIOS) {
      setFeedback({
        type: 'info',
        message: 'Tap the share icon and select "Add to Home Screen"'
      });
      setShowModal(false);
      setTimeout(() => setFeedback(null), 5000);
      return;
    }

    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setFeedback({ type: 'success', message: 'App installed! Ready to rant 🔥' });
      } else {
        setFeedback({ type: 'error', message: 'Maybe later. Rant space still here for you.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Installation failed. Please try again.' });
    }

    setShowModal(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDismiss = () => {
    setShowModal(false);
    // Optionally store dismissal in localStorage to not show again for some time
    localStorage.setItem('installPromptDismissed', Date.now());
  };

  // Don't show if already in standalone mode
  if (isStandalone) return null;

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
            <h2 className="text-lg font-semibold text-gray-800">
              {isIOS ? 'Add Rant On Me to Home Screen' : 'Install Rant On Me'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isIOS ? (
                <>
                  Tap <span className="font-bold">Share</span> then{' '}
                  <span className="font-bold">Add to Home Screen</span> to install this app.
                </>
              ) : (
                'Add Rant On Me to your home screen for faster access, offline support, and a better experience.'
              )}
            </p>

            {isIOS && (
              <div className="mt-3 flex justify-center">
                <div className="text-xs text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  Safari → Share → Add to Home Screen
                </div>
              </div>
            )}

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
                {isIOS ? 'Show Instructions' : 'Install Now'}
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
                ? 'bg-green-500 text-white'
                : feedback.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-[#ff8904] text-white'
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




// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// const InstallPrompt = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [feedback, setFeedback] = useState(null);

//   useEffect(() => {
//     const handleBeforeInstallPrompt = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowModal(true);
//     };

//     window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
//     return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
//   }, []);

//   const handleInstall = async () => {
//     if (!deferredPrompt) return;

//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;

//     if (outcome === 'accepted') {
//       setFeedback({ type: 'success', message: 'App installed! Ready to rant 🔥' });
//     } else {
//       setFeedback({ type: 'error', message: 'Maybe later. Rant space still here for you.' });
//     }

//     setShowModal(false);
//     setTimeout(() => setFeedback(null), 4000);
//   };

//   const handleDismiss = () => {
//     setShowModal(false);
//   };

//   return (
//     <>
//       {/* Install Prompt Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ y: 100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: 100, opacity: 0 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl p-4 sm:p-6 z-50 rounded-t-2xl"
//           >
//             <h2 className="text-lg font-semibold text-gray-800">Install Rant On Me</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Add Rant On Me to your home screen for faster access, offline support, and a better experience.
//             </p>

//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 onClick={handleDismiss}
//                 className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
//               >
//                 Maybe Later
//               </button>
//               <button
//                 onClick={handleInstall}
//                 className="px-4 py-2 text-sm bg-[#ff8904] hover:bg-[#f54a00] text-white rounded-md shadow-sm transition"
//               >
//                 Install Now
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Feedback Message */}
//       <AnimatePresence>
//         {feedback && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 30 }}
//             className={`fixed bottom-24 right-4 px-4 py-2 rounded-lg shadow-md text-sm font-medium z-50 ${
//               feedback.type === 'success'
//                 ? 'bg-[#ff8904] text-white'
//                 : 'bg-[#f54a00] text-white'
//             }`}
//           >
//             {feedback.message}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default InstallPrompt;


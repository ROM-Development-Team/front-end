import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const VoiceSelector = ({ 
  selectedVoice, 
  setSelectedVoice, 
  showVoiceMenu, 
  setShowVoiceMenu,
  isMuted
}) => {
  const voices = [
    { id: "alloy", name: "Alloy" },
    { id: "echo", name: "Echo" },
    { id: "fable", name: "Fable" },
    { id: "onyx", name: "Onyx" },
    { id: "nova", name: "Nova" },
    { id: "shimmer", name: "Shimmer" }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowVoiceMenu(!showVoiceMenu)}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-3 py-2 ${
          isMuted ? "text-red-500 bg-red-50" : "text-orange-600 hover:bg-orange-50"
        }`}
      >
        <span className="capitalize">{selectedVoice}</span>
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      
      <AnimatePresence>
        {showVoiceMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            <div className="py-1">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => {
                    setSelectedVoice(voice.id);
                    setShowVoiceMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    selectedVoice === voice.id
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {voice.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
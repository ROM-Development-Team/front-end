import { Send, Zap, Sparkles, AlertCircle } from "lucide-react";

export const SubmitButton = ({
  message,
  isSubmitting,
  handleInteraction,
  playSound,
  theme,
  currentTheme
}) => {
  return (
    <div className="opacity-0 animate-[fadeInUp_0.6s_ease-out_1.2s_forwards]">
      {/* Button with animated gradient background */}
      <div className="relative w-full">
        {/* Animated Gradient Background */}
        <div 
          className={`absolute inset-0 rounded-2xl ${theme.animation} ${theme.primary}`}
          style={{
            backgroundSize: '300% 300%',
            animation: 'gradientFlow 6s ease infinite'
          }}
        />
        
        {/* Button Content */}
        <button
          type="submit"
          disabled={!message.trim() || isSubmitting}
          onClick={() => {
            handleInteraction();
            if (message.trim() && !isSubmitting) {
              playSound('confetti');
            }
          }}
          className={`relative w-full py-5 rounded-2xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden ${
            !message.trim()
              ? "bg-gray-300 cursor-not-allowed"
              : isSubmitting
                ? "bg-gradient-to-r from-amber-500 to-orange-500 cursor-wait" // Changed to orange gradient
                : "bg-transparent hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Magic...</span>
              <Sparkles className="animate-[wiggle_0.5s_ease-in-out_infinite] text-amber-200" /> {/* Added amber tint */}
            </>
          ) : (
            <>
              <Send size={24} className="animate-[wiggle_2s_ease-in-out_infinite]" />
              <span>Send Message</span>
              <Zap size={20} className="animate-[wiggle_2s_ease-in-out_infinite_0.5s]" />
            </>
          )}

          {/* Hover effect */}
          {!isSubmitting && message.trim() && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[float_3s_ease-in-out_infinite] opacity-0 hover:opacity-100"></div>
          )}
        </button>
      </div>

      {!message.trim() && (
        <div className="flex items-center justify-center space-x-2 mt-3 text-sm text-gray-500 animate-[wiggle_1s_ease-in-out_infinite]">
          <AlertCircle size={16} />
          <span>Write something amazing first! ✨</span>
        </div>
      )}

      <style jsx global>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};
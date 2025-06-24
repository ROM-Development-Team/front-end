import { Type } from "lucide-react";

export const TextStyleSelector = ({ 
  textStyles,
  textStyle,
  setTextStyle,
  theme,
  handleInteraction,
  playSound
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.6s_forwards]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Text Style</span>
        <Type size={16} className="text-gray-500" />
      </div>
      <div className="flex space-x-2">
        {textStyles.map((style, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setTextStyle(style.class);
              handleInteraction();
              playSound();
            }}
            className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              textStyle === style.class
                ? "text-white scale-110"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {/* Gradient background - matches ThemeHeader animation exactly */}
            {textStyle === style.class && (
              <span 
                className={`absolute inset-0 rounded-lg ${theme.primary} ${theme.animation}`}
                style={{
                  backgroundSize: '300% 300%',
                  zIndex: -1,
                  animation: 'gradientFlow 6s ease infinite'
                }}
              />
            )}
            <span className={`relative z-10 ${style.class}`}>{style.name}</span>
          </button>
        ))}
      </div>

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
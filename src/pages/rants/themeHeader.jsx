import { Palette, Shuffle, Volume2, VolumeX, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { themes, backgroundPatterns } from "./themes";
import { RecipientCard } from "./recepientCard";

export const ThemeHeader = ({ 
  theme,
  currentTheme,
  setCurrentTheme,
  setBackgroundPattern,
  soundEnabled,
  setSoundEnabled,
  playSound,
  handleInteraction,
  rantOwner
}) => {
  const [floatingBubbles, setFloatingBubbles] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  // Create floating bubbles animation
  useEffect(() => {
    if (!isHovering) return;

    const bubbleInterval = setInterval(() => {
      const newBubble = {
        id: Date.now(),
        size: Math.random() * 20 + 10,
        left: Math.random() * 100,
        opacity: Math.random() * 0.4 + 0.1,
        duration: Math.random() * 10 + 10
      };
      
      setFloatingBubbles(prev => [...prev.slice(-10), newBubble]);
    }, 500);

    return () => clearInterval(bubbleInterval);
  }, [isHovering]);

  return (
    <div 
      className={`relative text-white p-6 pb-8 overflow-hidden transition-all duration-1000`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated Gradient Background */}
      <div 
        className={`absolute inset-0 ${theme.animation} ${theme.primary}`}
        style={{
          backgroundSize: '300% 300%',
          animation: 'gradientFlow 6s ease infinite'
        }}
      />

      {/* Floating bubbles animation */}
      {floatingBubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: '-20px',
            opacity: bubble.opacity,
            animation: `floatUp ${bubble.duration}s linear infinite`,
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Pulsing gradient overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-1000 bg-gradient-to-br from-white/10 via-transparent to-white/10 animate-[pulse_8s_ease-in-out_infinite]" />

      {/* Floating orb animation */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full animate-[float_3s_ease-in-out_infinite]"
          style={{ filter: 'blur(2px)' }}
        />
        <div 
          className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full animate-[float_2s_ease-in-out_infinite_0.5s]"
          style={{ filter: 'blur(1px)' }}
        />
        <div 
          className="absolute bottom-4 left-1/2 w-6 h-6 bg-white rounded-full animate-[float_4s_ease-in-out_infinite_1s]"
          style={{ filter: 'blur(1.5px)' }}
        />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="flex justify-between items-center mb-4 opacity-0 animate-[slideInDown_0.6s_ease-out_forwards]">
          <button
            onClick={() => {
              setCurrentTheme((prev) => (prev + 1) % themes.length);
              playSound();
              handleInteraction();
            }}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110 group"
          >
            <Palette size={20} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setBackgroundPattern((prev) => (prev + 1) % backgroundPatterns.length);
                handleInteraction();
              }}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110 group"
            >
              <Shuffle size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                handleInteraction();
              }}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110 group"
            >
              {soundEnabled ? (
                <Volume2 size={20} className="group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <VolumeX size={20} className="group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        <div className="text-center mb-6 opacity-0 animate-[slideInDown_0.6s_ease-out_0.2s_forwards]">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center space-x-2">
            <Sparkles className="animate-[wiggle_1s_ease-in-out_infinite hover:animate-[spin_2s_linear_infinite]" />
            <span className="hover:text-shadow-lg hover:shadow-white/50 transition-all duration-300">
              Anonymous Message
            </span>
            <Zap className="animate-[wiggle_1s_ease-in-out_infinite_0.5s hover:animate-[pulse_0.5s_ease-in-out_infinite]" />
          </h1>
          <p className="opacity-90 text-sm hover:scale-105 transition-transform duration-300">
            Share your thoughts in style!
          </p>
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <RecipientCard 
            rantOwner={rantOwner} 
            theme={themes[currentTheme]} 
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.2; }
          100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { background-position: 0% 50%; opacity: 0; }
          50% { background-position: 100% 50%; opacity: 0.3; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
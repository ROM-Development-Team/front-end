import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 300);

    const sparkleInterval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 500);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(sparkleInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-900 space-y-8">
      {/* Animated logo (matching your app) */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl opacity-20 animate-pulse"></div>
        <div className="relative w-full h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
          <Sparkles className={`w-10 h-10 text-white transition-all duration-300 ${showSparkles ? 'opacity-100 scale-110' : 'opacity-90 scale-100'}`} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Interactive message */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Preparing your rant space</p>
        <p className="text-sm text-gray-500 italic">
          {progress < 30 ? "Warming up the servers..." : 
           progress < 70 ? "Almost there..." : 
           "Final touches..."}
        </p>
      </div>

      {/* Fun interactive element - clickable sparkles */}
      <button 
        className="mt-4 px-4 py-2 text-xs bg-orange-50 text-orange-500 rounded-full hover:bg-orange-100 transition-colors flex items-center gap-1"
        onClick={() => setShowSparkles(true)}
      >
        <Sparkles className="w-3 h-3" />
        <span>Tap for good vibes</span>
      </button>
    </div>
  );
};

export default LoadingScreen;
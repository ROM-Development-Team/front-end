import React, { useState, useEffect, useRef } from "react";

const SendToVoid = () => {
  const [message, setMessage] = useState("");
  const [particles, setParticles] = useState([]);
  const [voidMessages, setVoidMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const containerRef = useRef(null);

  // Generate initial particles
  useEffect(() => {
    const initialParticles = [];
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.5 + 0.1,
      });
    }
    setParticles(initialParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y > 100 ? -5 : particle.y + particle.speed,
          opacity: Math.sin(Date.now() * 0.001 + particle.id) * 0.3 + 0.4,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Animate void messages
  useEffect(() => {
    const interval = setInterval(() => {
      setVoidMessages((prev) =>
        prev
          .map((msg) => ({
            ...msg,
            y: msg.y - 1,
            opacity: msg.opacity - 0.01,
          }))
          .filter((msg) => msg.opacity > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const sendToVoid = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      x: Math.random() * 60 + 20,
      y: 80,
      opacity: 1,
    };

    setVoidMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setMessageCount((prev) => prev + 1);

    // Add burst of particles
    const burstParticles = [];
    for (let i = 0; i < 10; i++) {
      burstParticles.push({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 70 + (Math.random() - 0.5) * 10,
        size: Math.random() * 4 + 2,
        opacity: 1,
        speed: Math.random() * 2 + 1,
      });
    }
    setParticles((prev) => [...prev, ...burstParticles]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    setIsTyping(value.length > 0);
  };

  const handleGoBack = () => {
    // You can replace this with your navigation logic
    window.history.back();
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden flex flex-col"
    >
      {/* Return button in top left */}
      <button 
        onClick={handleGoBack}
        className="absolute top-4 left-4 z-20 p-2 text-gray-300 hover:text-orange-500 transition-colors duration-300"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.3)`,
            }}
          />
        ))}
      </div>

      {/* Void messages floating away */}
      {voidMessages.map((msg) => (
        <div
          key={msg.id}
          className="absolute text-white text-sm font-light pointer-events-none transform transition-all duration-1000"
          style={{
            left: `${msg.x}%`,
            top: `${msg.y}%`,
            opacity: msg.opacity,
            transform: `translateY(-${(1 - msg.opacity) * 100}px) scale(${msg.opacity})`,
          }}
        >
          {msg.text}
        </div>
      ))}

      {/* Header */}
      <div className="relative z-10 pt-16 pb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg
            className="w-8 h-8 text-orange-500 animate-spin"
            style={{ animationDuration: "3s" }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
          </svg>
          <h1 className="text-3xl font-bold text-white tracking-wider">THE VOID</h1>
          <svg
            className="w-8 h-8 text-orange-500 animate-spin"
            style={{ animationDuration: "3s", animationDirection: "reverse" }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
          </svg>
        </div>
        <p className="text-gray-300 text-sm px-6">Send your thoughts into the infinite void</p>
        {messageCount > 0 && (
          <p className="text-orange-500 text-xs mt-2 animate-pulse">{messageCount} messages sent to the void</p>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Pulsing void center */}
          <div className="relative mb-12">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 animate-pulse">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-500/40 to-orange-600/40 animate-ping" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto my-auto rounded-full bg-black border-2 border-orange-500/50 animate-pulse">
              <div
                className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-spin"
                style={{ animationDuration: "4s" }}
              />
            </div>
          </div>

          {/* Input area */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={handleInputChange}
                placeholder="What do you want to tell the void?"
                className={`w-full bg-black/50 border-2 text-white placeholder-gray-400 resize-none transition-all duration-300 ${
                  isTyping
                    ? "border-orange-500 shadow-lg shadow-orange-500/20"
                    : "border-gray-600 hover:border-gray-500"
                } focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 p-2 rounded`}
                rows={4}
                maxLength={280}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">{message.length}/280</div>
            </div>

            <button
              onClick={sendToVoid}
              disabled={!message.trim()}
              className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 transition-all duration-300 rounded ${
                message.trim()
                  ? "shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-105"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <svg
                className="w-4 h-4 mr-2 inline"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              Send to Void
            </button>
          </div>

          {/* Mystical quote */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm italic animate-pulse">
              "In the void, all thoughts become one with the infinite..."
            </p>
          </div>
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />

      {/* Typing indicator effect */}
      {isTyping && <div className="absolute inset-0 bg-orange-500/5 animate-pulse pointer-events-none" />}
    </div>
  );
};

export default SendToVoid;
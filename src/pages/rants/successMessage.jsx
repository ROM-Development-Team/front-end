import { Check, ArrowRight } from "lucide-react";

export const SuccessMessage = ({ 
  theme, 
  showConfetti, 
  rantOwner, 
  resetForm 
}) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-100/50"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Fixed Confetti - Now falling downward */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => {
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            const size = Math.random() * 8 + 4;
            
            return (
              <div
                key={i}
                className="absolute rounded-sm"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `-10%`,
                  backgroundColor: `hsl(${Math.random() * 30 + 20}, 100%, 50%)`,
                  animation: `confetti-fall ${animationDuration}s linear ${delay}s infinite`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            );
          })}
        </div>
      )}

      {/* Main card */}
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center relative z-10 border border-orange-100/50 hover:shadow-xl transition-shadow duration-300">
        {/* Success icon */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[bounceIn_0.8s_ease-out]">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center animate-[pulse_2s_infinite]">
            <Check size={32} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Message Sent!</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your anonymous message is on its way to{" "}
          <span className="font-medium text-orange-600">
            {rantOwner.name}
          </span>
          . They'll receive it shortly.
        </p>

        {/* Action button */}
        <button
          onClick={resetForm}
          className="group relative overflow-hidden px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-300"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Send Another Message
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>

        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-orange-100/30 rounded-full blur-xl"></div>
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-orange-100/20 rounded-full blur-xl"></div>
      </div>

      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
    </div>
  );
};
import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-4 justify-start items-start animate-fadeIn">
      {/* Bot avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg">
        <Bot className="w-4 h-4 text-white" />
      </div>

      {/* Typing pulse bars */}
      <div className="bg-white border border-orange-100 shadow-md rounded-xl px-4 py-3 max-w-sm relative">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 items-end h-5">
            {[1, 2, 3, 4, 5].map((bar, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-orange-500 animate-bar"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1.2s",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bar {
          0%, 100% {
            height: 30%;
            opacity: 0.4;
          }
          50% {
            height: 100%;
            opacity: 1;
          }
        }

        .animate-bar {
          animation-name: bar;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

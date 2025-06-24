import { Square, Mic, PhoneOff } from "lucide-react";

export const ControlButtons = ({ 
  isConnected, 
  appState, 
  handleToggleConversation, 
  endConversation 
}) => {
  const getActionButtonLabel = () => {
    if (!isConnected) return "";
    switch (appState) {
      case "listening":
        return "Stop & Send";
      case "speaking":
        return "Stop AI";
      default:
        return "Start Speaking";
    }
  };

  return (
    <>
      {isConnected && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleToggleConversation}
            className={`w-14 h-14 rounded-full transition-all duration-300 shadow-lg ${
              appState === "listening" || appState === "speaking"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            } inline-flex items-center justify-center`}
          >
            {appState === "listening" || appState === "speaking" ? (
              <Square className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={endConversation}
            className="w-14 h-14 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-all duration-300 shadow-lg inline-flex items-center justify-center"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      )}

      {isConnected && (
        <div className="flex items-center justify-center gap-8 text-xs text-gray-600 mt-2">
          <span>{getActionButtonLabel()}</span>
          <span>End Call</span>
        </div>
      )}
    </>
  );
};
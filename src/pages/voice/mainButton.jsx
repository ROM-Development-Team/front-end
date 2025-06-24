import { 
  Bot, 
  Volume2, 
  Mic, 
  Loader2, 
  Phone 
} from "lucide-react";

export const MainButton = ({ 
  isConnected, 
  appState, 
  buttonScale, 
  startConversation 
}) => {
  const getMainButtonContent = () => {
    if (!isConnected) {
      return <Phone className="w-12 h-12" />;
    }

    switch (appState) {
      case "speaking":
        return (
          <div className="relative">
            <Volume2 className="w-12 h-12" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          </div>
        );
      case "listening":
        return <Mic className="w-12 h-12" />;
      case "processing":
        return <Loader2 className="w-12 h-12 animate-spin" />;
      default:
        return <Bot className="w-12 h-12" />;
    }
  };

  const getMainButtonColor = () => {
    if (!isConnected) return "bg-orange-500 hover:bg-orange-600";
    switch (appState) {
      case "speaking":
        return "bg-green-500 hover:bg-green-600";
      case "listening":
        return "bg-purple-500 hover:bg-purple-600";
      case "processing":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div className="relative flex justify-center mb-2">
      <button
        onClick={isConnected ? undefined : startConversation}
        className={`w-32 h-32 rounded-full text-white text-lg font-medium transition-all duration-300 shadow-2xl ${getMainButtonColor()} inline-flex items-center justify-center`}
        style={{ transform: `scale(${buttonScale})` }}
      >
        {getMainButtonContent()}
      </button>
    </div>
  );
};
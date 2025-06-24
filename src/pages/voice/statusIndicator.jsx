export const StatusIndicator = ({ isConnected, appState }) => {
  const getStatusText = () => {
    if (!isConnected) return "Start Voice Chat";
    switch (appState) {
      case "idle":
        return "Ready to listen";
      case "listening":
        return "Listening... Speak now";
      case "processing":
        return "AI is processing...";
      case "speaking":
        return "AI is speaking...";
      default:
        return "Ready";
    }
  };

  const getStatusColor = () => {
    if (!isConnected) return "text-gray-600";
    switch (appState) {
      case "idle":
        return "text-blue-600";
      case "listening":
        return "text-purple-600";
      case "processing":
        return "text-blue-600";
      case "speaking":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <p className={`text-lg font-semibold mb-4 transition-colors duration-300 ${getStatusColor()}`}>
      {getStatusText()}
    </p>
  );
};
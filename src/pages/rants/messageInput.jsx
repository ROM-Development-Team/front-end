import { MessageSquare, Zap } from "lucide-react";

export const MessageInput = ({
  message,
  setMessage,
  textareaRef,
  isTyping,
  textStyle,
  handleInteraction,
  interactiveIcons
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.8s_forwards] relative">
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
        <MessageSquare size={16} />
        <span>Your Message</span>
        <span className="text-red-500">*</span>
        {isTyping && (
          <div className="animate-[wiggle_0.5s_ease-in-out_infinite]">
            <Zap size={14} className="text-orange-500" />
          </div>
        )}
      </label>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleInteraction();
        }}
        placeholder="✨ Share your thoughts, feedback, or just say hello... Make it magical! ✨"
        rows={5}
        className={`w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 ${textStyle} hover:border-orange-300`}
        required
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{message.length}/500 characters</span>
          {message.length > 0 && (
            <div className="flex space-x-1">
              {interactiveIcons.slice(0, Math.min(3, Math.floor(message.length / 50))).map((icon, i) => (
                <div key={i} className={`${icon.color} animate-[wiggle_1s_ease-in-out_infinite]`}>
                  {icon.icon}
                </div>
              ))}
            </div>
          )}
        </div>
        {message.length > 450 && (
          <span className="text-xs text-orange-600 font-medium animate-[wiggle_0.5s_ease-in-out_infinite]">
            {500 - message.length} remaining
          </span>
        )}
      </div>
    </div>
  );
};
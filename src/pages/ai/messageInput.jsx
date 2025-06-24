import {
  Mic,
  Paperclip,
  Send 
} from "lucide-react";

export const MessageInput = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  isTyping,
  isRecording,
  onToggleRecording,
  inputRef
}) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={value}
              onChange={onChange}
              onKeyPress={onKeyPress}
              placeholder="What's your thoughts?"
              className="min-h-12 max-h-32 resize-none border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 pr-20 w-full rounded-md p-3 text-sm"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button
                onClick={onToggleRecording}
                className={`h-8 w-8 p-0 flex items-center justify-center rounded-md ${
                  isRecording ? "text-red-500" : "text-gray-400 hover:text-gray-600"
                } hover:bg-gray-100`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-100">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={onSend}
            disabled={!value.trim() || isTyping}
            className={`h-12 px-6 rounded-md flex items-center justify-center ${
              !value.trim() || isTyping
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white transition-colors`}
          >
            {isTyping ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Rant AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};
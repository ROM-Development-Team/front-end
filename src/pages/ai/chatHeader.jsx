import {
  ArrowLeft,
  Bot
} from "lucide-react";

export const ChatHeader = ({ onBack }) => {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">Rant AI</h1>
            <p className="text-sm text-gray-500">Your personal AI companion</p>
          </div>
        </div>
      </div>
    </div>
  );
};
import {
  Zap,
  MessageCircle,
  ImageIcon,
  Lightbulb
} from "lucide-react";

export const SuggestedPrompts = ({ prompts, onPromptSelect }) => {
  const iconForIndex = (index) => {
    const icons = [Zap, MessageCircle, ImageIcon, Lightbulb];
    return icons[index % icons.length];
  };

  const iconColors = [
    "text-orange-500",
    "text-blue-500",
    "text-purple-500",
    "text-green-500"
  ];

  return (
    <div className="px-4 py-4 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-gray-600 mb-3">Try asking me about:</p>
        <div className="grid grid-cols-2 gap-2">
          {prompts.map((prompt, index) => {
            const Icon = iconForIndex(index);
            const colorClass = iconColors[index % iconColors.length];
            return (
              <button
                key={index}
                onClick={() => onPromptSelect(prompt)}
                className="text-left justify-start bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 h-auto p-3 rounded-md transition-colors flex items-start"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${colorClass}`} />
                  <span className="text-sm">{prompt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
import { MessageSquare } from "lucide-react";
import { PromptGenerator, PromptGeneratorButton } from "./promptGenerator";

const backgroundColors = [
  { name: "Void Black", value: "from-gray-900 to-black", textColor: "text-white" },
  { name: "Sunset Orange", value: "from-orange-400 to-red-500", textColor: "text-white" },
  { name: "Mystic Purple", value: "from-purple-500 to-indigo-600", textColor: "text-white" },
  { name: "Ocean Blue", value: "from-blue-400 to-blue-600", textColor: "text-white" },
  { name: "Forest Green", value: "from-green-400 to-green-600", textColor: "text-white" },
  { name: "Rose Gold", value: "from-pink-400 to-orange-400", textColor: "text-white" },
];

export default function TextEditor({ 
  text, 
  backgroundColor,
  setPostData,
  selectedPrompt,
  setSelectedPrompt,
  postType 
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="p-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          Say something.
        </h2>
        <PromptGeneratorButton setSelectedPrompt={setSelectedPrompt} />
      </div>
      <div className="p-1">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setPostData(prev => ({ ...prev, text: e.target.value }))}
            placeholder={`Share your ${postType} with the world...`}
            className={`min-h-32 w-full resize-none border-0 focus:ring-0 text-lg outline-none p-3 rounded-lg ${
              backgroundColor
                ? `bg-gradient-to-br ${backgroundColor} ${
                    backgroundColors.find((bg) => bg.value === backgroundColor)?.textColor || "text-white"
                  } placeholder-white/70`
                : "bg-transparent text-gray-900 placeholder-gray-500"
            }`}
            maxLength={5000}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {text.length}/5000
          </div>
        </div>

        {selectedPrompt && (
          <PromptGenerator 
            selectedPrompt={selectedPrompt} 
            setSelectedPrompt={setSelectedPrompt} 
          />
        )}
      </div>
    </div>
  );
}
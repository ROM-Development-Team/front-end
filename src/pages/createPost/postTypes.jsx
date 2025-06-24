import { Lightbulb, MessageCircle, Zap, Sparkles } from "lucide-react";

const postTypes = [
  { name: "Thought", icon: Lightbulb, description: "Share a random thought" },
  { name: "Confession", icon: MessageCircle, description: "Anonymous confession" },
  { name: "Rant", icon: Zap, description: "Let it all out" },
  { name: "Question", icon: Sparkles, description: "Ask the world" },
];

export default function PostTypeSelector({ postType, setPostData }) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="p-4 pb-3 border-b border-gray-200 mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
          <Lightbulb className="w-5 h-5 text-orange-500" />
          What's on your mind?
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 px-4 pb-4">
        {postTypes.map((type) => (
          <button
            key={type.name}
            onClick={() => setPostData(prev => ({ ...prev, postType: type.name.toLowerCase() }))}
            className={`flex items-center gap-2 p-3 h-auto ${
              postType === type.name.toLowerCase()
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } rounded-md`}
          >
            <type.icon className="w-4 h-4" />
            <div className="text-left">
              <div className="font-medium text-sm">{type.name}</div>
              <div className="text-xs opacity-75">{type.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
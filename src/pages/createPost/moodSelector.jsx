import { Heart } from "lucide-react";
import { useState } from "react";

const moodCategories = {
  positive: [
    { name: "happy", emoji: "1f600" },
    { name: "excited", emoji: "1f929" },
    { name: "joyful", emoji: "1f602" },
    { name: "cheerful", emoji: "1f603" },
    { name: "content", emoji: "1f60a" },
    { name: "grateful", emoji: "1f64f" },
    { name: "relaxed", emoji: "1f60c" },
    { name: "playful", emoji: "1f61c" },
    { name: "hopeful", emoji: "1f60d" },
    { name: "energetic", emoji: "1f4aa" },
    { name: "optimistic", emoji: "1f642" },
    { name: "confident", emoji: "1f60e" },
    { name: "proud", emoji: "1f973" },
    { name: "inspired", emoji: "1f4af" },
    { name: "loving", emoji: "1f970" },
    { name: "calm", emoji: "1f60b" },
    { name: "amused", emoji: "1f923" }
  ],
  neutral: [
    { name: "bored", emoji: "1f634" },
    { name: "indifferent", emoji: "1f610" },
    { name: "contemplative", emoji: "1f914" },
    { name: "curious", emoji: "1f9d0" },
    { name: "pensive", emoji: "1f614" },
    { name: "conflicted", emoji: "1f615" },
    { name: "restless", emoji: "1f624" },
    { name: "distracted", emoji: "1f928" },
    { name: "daydreamy", emoji: "1f636" },
    { name: "tired", emoji: "1f62b" },
    { name: "numb", emoji: "1f643" },
    { name: "apathetic", emoji: "1f611" }
  ],
  negative: [
    { name: "sad", emoji: "1f625" },
    { name: "angry", emoji: "1f620" },
    { name: "anxious", emoji: "1f630" },
    { name: "worried", emoji: "1f61f" },
    { name: "lonely", emoji: "1f622" },
    { name: "frustrated", emoji: "1f641" },
    { name: "irritated", emoji: "1f47f" },
    { name: "embarrassed", emoji: "1f633" },
    { name: "guilty", emoji: "1f97a" },
    { name: "jealous", emoji: "1f92c" },
    { name: "insecure", emoji: "1f62c" },
    { name: "hurt", emoji: "1f915" },
    { name: "annoyed", emoji: "1f621" },
    { name: "disappointed", emoji: "1f61e" },
    { name: "overwhelmed", emoji: "1f630" },
    { name: "stressed", emoji: "1f625" },
    { name: "fearful", emoji: "1f628" },
    { name: "regretful", emoji: "1f62d" }
  ],
  intense: [
    { name: "shocked", emoji: "1f62e" },
    { name: "awestruck", emoji: "1f62f" },
    { name: "enraged", emoji: "1f92c" },
    { name: "panicked", emoji: "1f631" },
    { name: "euphoric", emoji: "1f60b" },
    { name: "melancholy", emoji: "1f614" },
    { name: "heartbroken", emoji: "1f494" },
    { name: "nostalgic", emoji: "1f9d0" },
    { name: "vulnerable", emoji: "1f616" },
    { name: "empowered", emoji: "1f4aa" },
    { name: "griefstricken", emoji: "1f62d" },
    { name: "disgusted", emoji: "1f92e" },
    { name: "paranoid", emoji: "1f635" },
    { name: "surreal", emoji: "1f47b" }
  ]
};

const categoryColors = {
  positive: "from-green-400 to-green-600",
  neutral: "from-blue-400 to-blue-600",
  negative: "from-red-400 to-red-600",
  intense: "from-purple-400 to-purple-600"
};

export default function MoodSelector({ mood, setPostData }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="p-4 pb-3 border-b border-gray-200 mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
          <Heart className="w-5 h-5 text-orange-500" />
          Tag your Mood
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.keys(moodCategories).map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setPostData(prev => ({ ...prev, mood: category }));
              }}
              className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center ${
                mood === category || selectedCategory === category
                  ? `bg-gradient-to-r ${categoryColors[category]} text-white shadow-md`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {selectedCategory && moodCategories[selectedCategory]?.map((moodItem) => (
            <button
              key={moodItem.name}
              onClick={() => setPostData(prev => ({ ...prev, mood: moodItem.name }))}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                mood === moodItem.name
                  ? `bg-gradient-to-r ${categoryColors[selectedCategory]} text-white shadow-md`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <img
                src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${moodItem.emoji}/512.gif`}
                alt={moodItem.name}
                className="w-8 h-8"
                onError={(e) => {
                  e.target.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif`;
                }}
              />
              <span className="text-sm font-medium capitalize">{moodItem.name}</span>
            </button>
          ))}
        </div>

        {mood && (() => {
          const category = Object.keys(moodCategories).find(cat => 
            moodCategories[cat].some(m => m.name === mood)
          );
          
          if (category) {
            const moodObj = moodCategories[category].find(m => m.name === mood);
            
            return (
              <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Your current mood:</p>
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${moodObj.emoji}/512.gif`}
                      alt={mood}
                      className="w-16 h-16 mb-2"
                      onError={(e) => {
                        e.target.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif`;
                      }}
                    />
                    <span className="text-lg font-semibold capitalize text-gray-800">
                      {mood}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}
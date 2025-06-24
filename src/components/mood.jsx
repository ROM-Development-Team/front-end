import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const moodCategories = {
  positive: [
    "happy", "excited", "joyful", "cheerful", "content", "grateful", "relaxed",
    "playful", "hopeful", "energetic", "optimistic", "confident", "proud",
    "inspired", "loving", "calm", "amused"
  ],
  neutral: [
    "bored", "indifferent", "contemplative", "curious", "pensive", "conflicted",
    "restless", "distracted", "daydreamy", "tired", "numb", "apathetic"
  ],
  negative: [
    "sad", "angry", "anxious", "worried", "lonely", "frustrated", "irritated",
    "embarrassed", "guilty", "jealous", "insecure", "hurt", "annoyed",
    "disappointed", "overwhelmed", "stressed", "fearful", "regretful"
  ],
  intense: [
    "shocked", "awestruck", "enraged", "panicked", "euphoric", "melancholy",
    "heartbroken", "nostalgic", "vulnerable", "empowered", "inspired",
    "grief-stricken", "disgusted", "paranoid", "surreal"
  ]
};

const moodEmojis = {
  happy: "1f600",
  excited: "1f929",
  joyful: "1f602",
  cheerful: "1f603",
  content: "1f60a",
  grateful: "1f64f",
  relaxed: "1f60c",
  playful: "1f61c",
  hopeful: "1f60d",
  energetic: "1f4aa",
  optimistic: "1f642",
  confident: "1f60e",
  proud: "1f973",
  inspired: "1f4af",
  loving: "1f970",
  calm: "1f60b",
  amused: "1f923",
  bored: "1f634",
  indifferent: "1f610",
  contemplative: "1f914",
  curious: "1f9d0",
  pensive: "1f614",
  conflicted: "1f615",
  restless: "1f624",
  distracted: "1f928",
  daydreamy: "1f636",
  tired: "1f62b",
  numb: "1f643",
  apathetic: "1f611",
  sad: "1f625",
  angry: "1f620",
  anxious: "1f630",
  worried: "1f61f",
  lonely: "1f622",
  frustrated: "1f641",
  irritated: "1f47f",
  embarrassed: "1f633",
  guilty: "1f97a",
  jealous: "1f92c",
  insecure: "1f62c",
  hurt: "1f915",
  annoyed: "1f621",
  disappointed: "1f61e",
  overwhelmed: "1f630",
  stressed: "1f625",
  fearful: "1f628",
  regretful: "1f62d",
  shocked: "1f62e",
  awestruck: "1f62f",
  enraged: "1f92c",
  panicked: "1f631",
  euphoric: "1f60b",
  melancholy: "1f614",
  heartbroken: "1f494",
  nostalgic: "1f9d0",
  vulnerable: "1f616",
  empowered: "1f4aa",
  griefstricken: "1f62d",
  disgusted: "1f92e",
  paranoid: "1f635",
  surreal: "1f47b"
};

const MoodBox = ({ mood, mood_note, onSave, isUpdating = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentMood, setCurrentMood] = useState(mood || "");
  const [currentNote, setCurrentNote] = useState(mood_note || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showEmojiAnimation, setShowEmojiAnimation] = useState(false);

  // Sync with props
  useEffect(() => {
    setCurrentMood(mood || "");
    setCurrentNote(mood_note || "");
    
    // Determine initial category based on current mood
    if (mood) {
      for (const [category, moods] of Object.entries(moodCategories)) {
        if (moods.includes(mood)) {
          setSelectedCategory(category);
          break;
        }
      }
    }
  }, [mood, mood_note]);

  const getEmojiCode = (mood) => {
    if (!mood) return "1f600"; // Default smiley
    const normalizedMood = mood.toLowerCase().replace(/-/g, '');
    return moodEmojis[normalizedMood] || "1f600";
  };

  const calculateIntensity = () => {
    if (!selectedCategory) return 0;
    if (selectedCategory === "intense") return 3;
    if (selectedCategory === "positive" || selectedCategory === "negative") return 2;
    return 1; // neutral
  };

  const handleSave = () => {
    if (!currentMood) {
      alert("Please select a mood");
      return;
    }

    onSave({
      mood: currentMood,
      mood_note: currentNote,
      category: selectedCategory,
      intensity: calculateIntensity()
    });
    
    setIsEditing(false);
    setShowEmojiAnimation(true);
    setTimeout(() => setShowEmojiAnimation(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-6 mb-6 relative">
      {showEmojiAnimation && currentMood && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-90 rounded-2xl animate-fadeIn">
          <img
            src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiCode(currentMood)}/512.gif`}
            alt={currentMood}
            className="w-32 h-32"
            onError={(e) => {
              e.target.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif`;
            }}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Mood</h3>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isUpdating}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            isEditing ? "bg-green-500 text-white" : "bg-orange-500 text-white"
          }`}
        >
          {isEditing ? (isUpdating ? "Updating..." : "Save") : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              How are you feeling overall?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {Object.entries({
                positive: "Positive",
                neutral: "Neutral",
                negative: "Negative",
                intense: "Intense"
              }).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedCategory === key
                      ? `border-${key === 'positive' ? 'green' : key === 'negative' ? 'red' : key === 'neutral' ? 'gray' : 'purple'}-500 bg-${key === 'positive' ? 'green' : key === 'negative' ? 'red' : key === 'neutral' ? 'gray' : 'purple'}-50 font-medium`
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {selectedCategory && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Select your specific mood
              </label>
              <div className="flex flex-wrap gap-2 mb-4 max-h-60 overflow-y-auto p-1">
                {moodCategories[selectedCategory]?.map(moodItem => (
                  <button
                    key={moodItem}
                    onClick={() => setCurrentMood(moodItem)}
                    className={`px-3 py-1.5 rounded-full border text-sm capitalize transition-all ${
                      currentMood === moodItem
                        ? `bg-${selectedCategory === 'positive' ? 'orange' : selectedCategory === 'negative' ? 'red' : selectedCategory === 'neutral' ? 'gray' : 'purple'}-100 border-${selectedCategory === 'positive' ? 'orange' : selectedCategory === 'negative' ? 'red' : selectedCategory === 'neutral' ? 'gray' : 'purple'}-300 text-${selectedCategory === 'positive' ? 'orange' : selectedCategory === 'negative' ? 'red' : selectedCategory === 'neutral' ? 'gray' : 'purple'}-700 font-medium`
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {moodItem}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Mood Note (optional)
            </label>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Add any notes about how you're feeling..."
              rows={3}
              className="w-full p-3 rounded-xl border border-orange-300 resize-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {currentMood ? (
              <>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  moodCategories.positive.includes(currentMood) 
                    ? 'bg-orange-100 text-orange-800' 
                    : moodCategories.negative.includes(currentMood)
                      ? 'bg-red-100 text-red-800'
                      : moodCategories.intense.includes(currentMood)
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                }`}>
                  {currentMood}
                </span>
                <img 
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiCode(currentMood)}/512.png`} 
                  alt={currentMood}
                  className="w-6 h-6"
                  onError={(e) => {
                    e.target.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.png`;
                  }}
                />
              </>
            ) : (
              <span className="text-gray-500 italic">No mood selected</span>
            )}
          </div>
          
          {currentNote && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">{currentNote}</p>
            </div>
          )}
        </div>
      )}

      <div className="text-right pt-2">
        <Link
          to="/thermometer"
          onClick={() => console.log("Navigate to Emotional Thermometer")}
          className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 hover:underline transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v10.28a2 2 0 001.47 1.94 4 4 0 11-2.94 0A2 2 0 0012 13.28V3"
            />
          </svg>
          View Emotional Thermometer
        </Link>
      </div>
    </div>
  );
};

export default MoodBox;
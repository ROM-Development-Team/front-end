import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../components/navBar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LoadingScreen from "../../components/loadingScreen";
import StatusMessage from "../../utils/statusMessage";
import { getEmotionalThermometer } from "../../../api/emotionalThermometer";

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

const getEmojiCode = (mood) => {
  if (!mood) return "1f600";
  const normalizedMood = mood.toLowerCase().replace(/-/g, '');
  return moodEmojis[normalizedMood] || "1f600";
};

const getIntensityLabel = (intensity) => {
  const labels = {
    1: "Very Low",
    2: "Low",
    3: "Moderate",
    4: "High",
    5: "Very High"
  };
  return labels[intensity] || "Unknown";
};

const EmotionalThermometer = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [thermoData, setThermoData] = useState({
    current: {},
    analytics: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadThermometer = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.user_id || !user?.token) {
          throw new Error("User authentication data not found");
        }

        const result = await getEmotionalThermometer(
          user.user_id,
          user.token
        );

        if (result.status === "success") {
          setThermoData(result.data);
        } else {
          throw new Error(result.message || "Failed to load data");
        }
      } catch (err) {
        console.error("Error loading thermometer data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadThermometer();
  }, []);

  const formatFirebaseTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";

    let date;
    try {
      if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else {
        return "N/A";
      }

      const now = new Date();
      const expiryDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      const diffMs = expiryDate - now;

      if (diffMs <= 0) {
        return "Expired";
      }

      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${diffHours}h ${diffMinutes}m`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return "N/A";
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) {
    return (
      <StatusMessage 
        type="error"
        title="Error Loading Data"
        message={error || "We couldn't load your mood data."}
        primaryAction={{ label: "Back to Profile", path: "/profile" }}
        secondaryAction={{ label: "Contact Support", path: "/support" }}
      />
    );
  }
  if (!thermoData || !thermoData.current) {
    return (
      <StatusMessage 
        type="empty"
        title="No Mood Data Available"
        message="You haven't recorded any mood check-ins yet. Start tracking to see your emotional patterns."
        primaryAction={{ label: "Back to Profile", path: "/profile" }}
        iconBgColor="bg-orange-400"
        primaryButtonColor="bg-orange-500 hover:bg-orange-600"
        secondaryButtonColor="border-orange-500 text-orange-500 hover:bg-orange-50"
      />
    );
  }

  // Safely prepare chart data
  const intensityData = (thermoData.analytics?.intensity_trend || []).map((intensity, index) => ({
    time: index + 1,
    intensity: parseFloat(intensity) || 0
  }));

  // Safely prepare category data
  const moodTypeCount = thermoData.analytics?.mood_type_count || {};
  const maxCategoryValue = Math.max(...Object.values(moodTypeCount), 1);
  const categoryData = Object.entries(moodTypeCount).map(([name, value]) => ({
    name,
    value,
    color: name === "positive" ? "#f97316" : name === "negative" ? "#ef4444" : "#64748b"
  }));

  return (
    <>
      <div className="relative max-w-4xl mx-auto p-4 md:p-8 pb-28">
        <div className="flex items-center space-x-4 mb-6 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 shadow">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h3 className="text-lg font-semibold text-white">Emotional Thermometer</h3>
        </div>

        {/* Current Mood Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Current Mood</h3>
              <span className="text-xs text-gray-500">
                Expires in {formatFirebaseTimestamp(thermoData?.current?.timestamp) || "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <img
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiCode(thermoData?.current?.mood)}/512.gif`}
                  alt={thermoData?.current?.mood || "current mood"}
                  className="w-12 h-12"
                  onError={(e) => {
                    e.target.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif`;
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-800 capitalize">
                  {thermoData?.current?.mood || "Unknown mood"}
                </h4>
                {thermoData?.current?.note && (
                  <p className="text-gray-600 text-sm">{thermoData.current.note}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs font-medium text-gray-500">Intensity:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          level <= (thermoData?.current?.intensity || 0) 
                            ? "bg-orange-500 scale-110" 
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-orange-600">
                    {getIntensityLabel(thermoData?.current?.intensity || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intensity Trend Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Intensity Trend</h3>
          <div className="w-full" style={{ height: "200px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={intensityData}
                margin={{ top: 10, right: 10, left: -40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} tickCount={6} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Categories</h3>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{category.name}</span>
                    <span className="text-sm font-semibold text-gray-600">{category.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700 animate-[slideUp_0.8s_ease-out]"
                      style={{
                        backgroundColor: category.color,
                        width: `${(category.value / maxCategoryValue) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Most Common Mood */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <img
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiCode(thermoData?.analytics?.most_common_mood)}/512.gif`}
                  alt={thermoData?.analytics?.most_common_mood || "common mood"}
                  className="w-6 h-6"
                  onError={(e) => {
                    e.target.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif`;
                  }}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Most Common</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {thermoData?.analytics?.most_common_mood || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <img
                  src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif"
                  alt="peak hours"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Peak Hours</p>
                <p className="font-semibold text-gray-800">
                  {thermoData?.analytics?.peak_hours?.positive || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Mood Streak */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <img
                  src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif"
                  alt="streak"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Mood Streak</p>
                <p className="font-semibold text-gray-800">
                  {thermoData?.analytics?.mood_streak_days ?? 0} days
                </p>
              </div>
            </div>
          </div>

          {/* Most Intense Mood */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <img
                  src="https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/512.gif"
                  alt="intense"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Most Intense</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {thermoData?.analytics?.most_intense_mood?.mood || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  Intensity: {thermoData?.analytics?.most_intense_mood?.intensity || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Distribution</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(thermoData?.analytics?.mood_distribution || {}).map(([mood, count], index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => setSelectedMood({ mood, count })}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiCode(mood)}/512.gif`}
                    alt={mood}
                    className="w-8 h-8"
                    onError={(e) => {
                      e.target.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif`;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">{mood}</p>
                    <p className="text-sm text-gray-600">{count} {count === 1 ? "time" : "times"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Navbar />
    </>
  );
};

export default EmotionalThermometer;
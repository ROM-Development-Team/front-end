import { useState, useEffect } from "react";
import {
  User,
  Heart,
  TrendingUp,
  Camera,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navBar";
import SettingsSidebar from "../components/settings";
import Modal from "../components/modal";
import LoadingScreen from "../components/loadingScreen";

// API
import { getAccountSettings } from "../../api/accountSettings";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingMood, setIsEditingMood] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
    rantLink: "",
    email: "",
    bio: "",
    location: "",
    mood: "",
    mood_note: "",
  });

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
  const fetchProfileData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.user_id || !user?.token) {
      console.warn("User not found in localStorage. Redirecting...");
      navigate("/login");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await getAccountSettings(user.user_id, user.token);

      if (response.status === "success" && response.data) {
        setProfileData({
          profileImage: response.data.profile,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          username: response.data.username,
          rantLink: response.data.rant_link,
          email: response.data.email,
          bio: response.data.bio,
          mood: response.data.mood,
          mood_note: response.data.mood_note,
        });
      } else {
        console.error("Profile load error:", response.message);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false); // Done loading
    }
  };

  fetchProfileData();
}, [navigate]);

  return (
    <>
    {loading ? (
      <LoadingScreen />
    ) : (
      <>
        <div className="relative max-w-4xl mx-auto p-4 md:p-8 pb-28">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-300 to-orange-400 text-white p-6 rounded-2xl mb-6 relative">
            <button
              onClick={() => setShowSettings(true)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <Settings size={20} />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white/30 rounded-full overflow-hidden border border-white shadow-md">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600">
                      <User size={32} />
                    </div>
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 bg-white shadow-md w-8 h-8 flex items-center justify-center rounded-full">
                  <Camera size={14} className="text-orange-600" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-sm opacity-90">{profileData.email}</p>
                <div className="flex gap-6 mt-2">
                  <div className="text-center">
                    <p className="font-bold text-lg">127</p>
                    <p className="text-xs">Posts</p>
                  </div>
                  <div className="text-center cursor-pointer" onClick={() => navigate('/followers')}>
                    <p className="font-bold text-lg">2.3K</p>
                    <p className="text-xs">Followers</p>
                  </div>
                  <div className="text-center cursor-pointer" onClick={() => navigate('/following')}>
                    <p className="font-bold text-lg">892</p>
                    <p className="text-xs">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rant Link Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Rant Link</h3>

            <label className="text-sm font-medium text-gray-600 mb-1 block">Copy and share your rant link</label>
            <div className="flex items-center rounded-xl overflow-hidden border border-gray-300">
              <input
                type="text"
                readOnly
                value={`${profileData.rantLink}`}
                className="w-full px-4 py-2 text-sm bg-gray-50 text-gray-700 outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${profileData.rantLink}`);
                  setShowModal(true);
                }}
                className="bg-orange-500 text-white px-4 py-2 text-sm font-medium hover:bg-orange-600 transition"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Mood Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Mood</h3>
              <button
                onClick={() => setIsEditingMood(!isEditingMood)}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  isEditingMood ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                }`}
              >
                {isEditingMood ? "Save" : "Edit"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Mood</label>
                <input
                  type="text"
                  value={profileData.mood}
                  disabled={!isEditingMood}
                  onChange={(e) => handleInputChange("mood", e.target.value)}
                  className={`w-full p-3 rounded-xl border ${
                    isEditingMood ? "border-orange-300" : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Mood Note</label>
                <textarea
                  value={profileData.mood_note}
                  disabled={!isEditingMood}
                  onChange={(e) => handleInputChange("mood_note", e.target.value)}
                  rows={3}
                  className={`w-full p-3 rounded-xl border resize-none ${
                    isEditingMood ? "border-orange-300" : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>
            </div>

            <div className="text-right pt-2">
              <Link
                to=""
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

          {/* Profile Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  isEditing ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                }`}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {["firstName", "lastName"].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                      {field === "firstName" ? "First Name" : "Last Name"}
                    </label>
                    <input
                      type="text"
                      value={profileData[field]}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={`w-full p-3 rounded-xl border ${
                        isEditing ? "border-orange-300" : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full p-3 rounded-xl border ${
                    isEditing ? "border-orange-300" : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Bio</label>
                <textarea
                  value={profileData.bio}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className={`w-full p-3 rounded-xl border resize-none ${
                    isEditing ? "border-orange-300" : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div
              className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition cursor-pointer"
              onClick={() => navigate('/stats')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp size={18} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Engagement</p>
                  <p className="text-xl font-bold text-orange-600">8.7</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition cursor-pointer"
              onClick={() => navigate('/activity')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Activity</p>
                  <p className="text-xl font-bold text-green-600">94%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Navbar />
        <SettingsSidebar show={showSettings} onClose={() => setShowSettings(false)} />
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          message="You can share this link across different platforms to receive anonymous messages."
        />
      </>
      )}
    </>
  );
};

export default Profile;

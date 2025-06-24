import { useState, useEffect } from "react";
import {
  User,
  Camera,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navBar";
import SettingsSidebar from "../components/settings";
import SEModal from "../components/se-modal";
import LoadingScreen from "../components/loadingScreen";
import MoodBox from "../components/mood";

// API
import { getAccountSettings, updateAccountSettings } from "../../api/accountSettings";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingMood, setIsUpdatingMood] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingMood, setIsEditingMood] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

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
        console.warn("User not found. Redirecting...");
        navigate("/");
        return;
      }

      setLoading(true);

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
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleProfileSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.user_id || !user?.token) return;

    setIsUpdatingProfile(true);

    const updates = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      email: profileData.email,
      bio: profileData.bio,
    };

    try {
      const response = await updateAccountSettings(user.user_id, user.token, updates);
      if (response.status === "success") {
        setIsEditing(false);
        setModal({
          show: true,
          title: "Profile Updated 🎉",
          message: response.message || "Your profile has been updated successfully!",
        });
      } else {
        setModal({
          show: true,
          title: "Update Failed ❌",
          message: response.message || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      setModal({
        show: true,
        title: "Server Error",
        message: "Something went wrong. Please try again later.",
      });
      console.error("Update error:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleMoodSave = async (moodData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.user_id || !user?.token) return;

    setIsUpdatingMood(true);

    try {
      const updates = {
        mood: moodData.mood || "",
        mood_note: moodData.mood_note || ""
      };

      const response = await updateAccountSettings(user.user_id, user.token, updates);

      if (response.status === "success") {
        // Update UI state
        setProfileData(prev => ({
          ...prev,
          mood: updates.mood,
          mood_note: updates.mood_note
        }));

        setModal({
          show: true,
          title: "Mood Saved 😊",
          message: response.message || "Your mood has been updated!"
        });
      } else {
        setModal({
          show: true,
          title: "Mood Save Failed 😞",
          message: response.message || "Could not save your mood. Try again."
        });
      }
    } catch (error) {
      console.error("Mood update error:", error);
      setModal({
        show: true,
        title: "Server Error",
        message: "An unexpected error occurred. Please try again later."
      });
    } finally {
      setIsUpdatingMood(false);
    }
  };

  return (
    <>
    {loading ? (
      <LoadingScreen />
    ) : (
      <>
        <div className="relative max-w-4xl mx-auto p-4 md:p-8 pb-28">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-300 to-orange-400 text-white p-4 rounded-xl mb-6 relative">
            <button
              onClick={() => setShowSettings(true)}
              className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <Settings size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-14 h-14 bg-white/30 rounded-full overflow-hidden border border-white shadow-md">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600">
                      <User size={24} />
                    </div>
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 bg-white shadow-md w-7 h-7 flex items-center justify-center rounded-full">
                  <Camera size={14} className="text-orange-600" />
                </button>
              </div>

              <div className="flex-grow">
                <h2 className="text-lg font-semibold leading-tight">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-xs opacity-90">{profileData.email}</p>
                <div className="flex gap-5 mt-2">
                  <div className="text-center">
                    <p className="font-bold text-base">127</p>
                    <p className="text-xs">Posts</p>
                  </div>
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => navigate('/followers')}
                  >
                    <p className="font-bold text-base">2.3K</p>
                    <p className="text-xs">Followers</p>
                  </div>
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => navigate('/following')}
                  >
                    <p className="font-bold text-base">892</p>
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
                // value={`${profileData.rantLink}`}
                value={`https://rantonme.netlify.app/${profileData.username}`}
                className="w-full px-4 py-2 text-sm bg-gray-50 text-gray-700 outline-none"
              />
              <button
                onClick={() => {
                  // navigator.clipboard.writeText(`${profileData.rantLink}`);
                  navigator.clipboard.writeText(`https://rantonme.netlify.app/${profileData.username}`);
                  setShowModal(true);
                }}
                className="bg-orange-500 text-white px-4 py-2 text-sm font-medium hover:bg-orange-600 transition"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Mood Box */}
          <MoodBox
            mood={profileData.mood}
            mood_note={profileData.mood_note}
            onSave={handleMoodSave}
            isUpdating={isUpdatingMood}
          />

          {/* Profile Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
              <button
                onClick={() => {
                  if (isEditing) handleProfileSave();
                  else setIsEditing(true);
                }}
                disabled={isUpdatingProfile}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  isEditing ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                }`}
              >
                {isEditing ? (isUpdatingProfile ? "Updating..." : "Save") : "Edit"}
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
        </div>

        <Navbar />
        <SettingsSidebar show={showSettings} onClose={() => setShowSettings(false)} />
        <SEModal
          show={showModal}
          title="Rant Link Copied!"
          onClose={() => setShowModal(false)}
          message="You can share this link across different platforms to receive anonymous messages."
        />
        <SEModal
          show={modal.show}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal({ show: false, title: "", message: "" })}
        />
      </>
      )}
    </>
  );
};

export default Profile;

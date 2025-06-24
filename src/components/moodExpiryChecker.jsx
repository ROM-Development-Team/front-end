import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusMessage from "../utils/statusMessage";
import LoadingScreen from "./loadingScreen";
import { getEmotionalThermometer } from "../../api/emotionalThermometer";

const MoodExpiryChecker = ({ children }) => {
  const [showErrorScreen, setShowErrorScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMoodExpiry = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.user_id || !user?.token) {
        console.warn("Missing user ID or token");
        setLoading(false);
        return;
      }

      const { status, data } = await getEmotionalThermometer(user.user_id, user.token);

      if (status === "success") {
        const moodTimestamp = data?.current?.timestamp;
        if (!moodTimestamp) {
          setShowErrorScreen(true);
        } else {
          const moodDate = new Date(moodTimestamp);
          const now = new Date();
          const hoursDiff = Math.floor((now - moodDate) / (1000 * 60 * 60));
          setShowErrorScreen(hoursDiff >= 24);
        }
      } else {
        setShowErrorScreen(true);
      }

      setLoading(false);
    };

    checkMoodExpiry();
  }, []);

  if (loading) return <LoadingScreen />;
  if (showErrorScreen) return <ExpiredMoodScreen />;

  return children;
};

const ExpiredMoodScreen = () => (
  <StatusMessage
    type="empty"
    title="Update Your Mood"
    message="Your current mood has expired. Please update it to continue."
    primaryAction={{
      label: "Update Mood",
      path: "/profile",
    }}
    iconBgColor="bg-orange-400"
    primaryButtonColor="bg-orange-500 hover:bg-orange-600"
    secondaryButtonColor="border-orange-500 text-orange-500 hover:bg-orange-50"
  />
);

export default MoodExpiryChecker;

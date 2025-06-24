import { useState } from "react";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Zap,
  User,
  MoreHorizontal,
  Check,
  CheckCheck,
  AlertTriangle,
  X
} from "lucide-react";
import Navbar from "../components/navBar";

export default function Notifications() {
  const [showDevNotice, setShowDevNotice] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      user: { name: "Void Walker", username: "@voidwalker" },
      content: "liked your void message",
      targetContent: "Sometimes I wonder if the stars can hear our thoughts...",
      timestamp: "2m ago",
      isRead: false,
      redirectUrl: "/void/message/123",
    },
    {
      id: 2,
      type: "comment",
      user: { name: "Silent Echo", username: "@silentecho" },
      content: "replied to your confession",
      targetContent: "I feel the same way about midnight conversations with myself",
      timestamp: "15m ago",
      isRead: false,
      redirectUrl: "/confession/456",
    },
    {
      id: 3,
      type: "follow",
      user: { name: "Cosmic Whisper", username: "@cosmicwhisper" },
      content: "started following you",
      timestamp: "1h ago",
      isRead: false,
      redirectUrl: "/profile/cosmicwhisper",
    },
    {
      id: 4,
      type: "mention",
      user: { name: "Night Thoughts", username: "@nightthoughts" },
      content: "mentioned you in a rant",
      targetContent: "Why do @currentuser and others think coffee solves everything?",
      timestamp: "2h ago",
      isRead: true,
      redirectUrl: "/rant/789",
    },
    {
      id: 5,
      type: "rant",
      user: { name: "Restless Mind", username: "@restlessmind" },
      content: "reacted to your rant of the day",
      targetContent: "People who use speaker phone in public spaces...",
      timestamp: "4h ago",
      isRead: true,
      redirectUrl: "/rant/101",
    },
    {
      id: 6,
      type: "confession",
      user: { name: "Quiet Soul", username: "@quietsoul" },
      content: "shared a confession in your circle",
      targetContent: "I still count on my fingers when no one is looking",
      timestamp: "6h ago",
      isRead: true,
      redirectUrl: "/confession-circle/202",
    },
    {
      id: 7,
      type: "like",
      user: { name: "Dream Chaser", username: "@dreamchaser" },
      content: "liked your mood post",
      targetContent: "Feeling like a contemplative wanderer today",
      timestamp: "1d ago",
      isRead: true,
      redirectUrl: "/mood/303",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "mention":
        return <AtSign className="w-4 h-4 text-purple-500" />;
      case "rant":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case "confession":
        return <MessageCircle className="w-4 h-4 text-pink-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    }
    console.log(`Navigating to: ${notification.redirectUrl}`);
  };

  const markAsRead = (id, event) => {
    event.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {showDevNotice ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <div className="flex justify-between items-start">
                <div className="text-sm text-yellow-700">
                  <h2 className="font-bold text-base mb-1">Notifications Temporarily Unavailable</h2>
                  <p>We're currently upgrading this feature with exciting new capabilities. 
                  The notification system will return soon with improved functionality 
                  and a better user experience.</p>
                </div>
                <button
                  onClick={() => setShowDevNotice(false)}
                  className="ml-4 text-yellow-700 hover:text-yellow-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`text-orange-600 border-orange-200 hover:bg-orange-50 text-sm px-3 py-1 border rounded-md ${
                  unreadCount === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center">
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark all read
                </div>
              </button>
            </div>
            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`text-sm px-3 py-1 rounded-md ${
                  filter === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`text-sm px-3 py-1 rounded-md ${
                  filter === "unread"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-gray-400 text-sm">
                {filter === "unread"
                  ? "All caught up! Check back later for new updates."
                  : "When people interact with your content, you'll see it here."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md p-4 rounded-lg ${
                    notification.isRead
                      ? "bg-white border border-gray-200"
                      : "bg-orange-50 border border-orange-200 shadow-sm"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getNotificationIcon(notification.type)}
                            <span className="font-medium text-gray-900">{notification.user.name}</span>
                            <span className="text-gray-600 text-sm">{notification.content}</span>
                          </div>
                          {notification.targetContent && (
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2 mt-2 italic">
                              "{notification.targetContent}"
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{notification.timestamp}</span>
                            <span className="text-xs text-gray-400">{notification.user.username}</span>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => markAsRead(notification.id, e)}
                              className="text-orange-600 hover:bg-orange-100 p-1 rounded"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
      )}

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20" />
      <Navbar/>
    </div>
  );
}
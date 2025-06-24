"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  User,
  Clock,
  Zap,
  Lightbulb,
  Flag,
  EyeOff,
  Bookmark,
  Trash2,
  Sparkles,
  TrendingUp,
  X,
  Globe,
  Users,
  Lock,
  Volume2,
  HelpCircle,
} from "lucide-react";
import Navbar from "../components/navBar";
import LoadingScreen from "../components/loadingScreen";
import { MarkDown } from "../utils/markdown";
import { moodEmojis } from "../utils/moodEmojis";
import { getPosts } from "../../api/posts";

const getEmojiCode = (mood) => {
  const normalizedMood = mood?.toLowerCase();
  return moodEmojis[normalizedMood] || "1f600";
};

export default function FeedPage() {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 10,
    total_count: 0,
    has_next: false,
    has_prev: false
  });
  const [showMenus, setShowMenus] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async (page = 1, forceRefresh = false) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.user_id || !user?.token) {
      console.warn("User not found. Redirecting...");
      navigate("/");
      return;
    }
    try {
      setLoading(true);
      const response = await getPosts(
        user.user_id, 
        user.token, 
        page, 
        pagination.limit,
        forceRefresh 
      );

      if (response.status === 'error') {
        throw new Error(response.message);
      }

      if (page === 1) {
        setFeedItems(response.data || []);
      } else {
        setFeedItems(prev => [...(prev || []), ...(response.data || [])]);
      }

      setPagination({
        current_page: response.pagination?.current_page || page,
        limit: response.pagination?.limit || pagination.limit,
        total_count: response.pagination?.total_count || 0,
        has_next: response.pagination?.has_next || false,
        has_prev: response.pagination?.has_prev || false
      });

      setError(null);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up beforeunload listener to mark upcoming refresh
    const handleBeforeUnload = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.user_id) {
        const cacheKey = `posts-${user.user_id}-1-10`;
        const cacheName = 'posts-cache';
        
        try {
          const cache = await caches.open(cacheName);
          const response = await cache.match(cacheKey);
          
          if (response) {
            const data = await response.json();
            // Add refresh flag to cached data
            await cache.put(
              cacheKey,
              new Response(JSON.stringify({
                ...data,
                isRefresh: true
              }))
            );
          }
        } catch (error) {
          console.error('Error setting refresh flag:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initial fetch
    fetchPosts(1, false);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    fetchPosts(pagination.current_page + 1);
  };

  const handleMenuAction = (itemId, action) => {
    switch (action) {
      case "report":
        alert("Content reported. Thank you for keeping the void safe.");
        break;
      case "unsee":
        setFeedItems((prev) => prev.filter((item) => item.id !== itemId));
        if (selectedPost?.id === itemId) setSelectedPost(null);
        break;
      case "bookmark":
        alert("Added to your void bookmarks");
        break;
      case "delete":
        if (window.confirm("Delete this post from the void?")) {
          setFeedItems((prev) => prev.filter((item) => item.id !== itemId));
          if (selectedPost?.id === itemId) setSelectedPost(null);
        }
        break;
    }
    setShowMenus({ ...showMenus, [itemId]: false });
  };

  const openPostModal = (item) => {
    setSelectedPost(item);
    setShowMenus({});
  };

  const getCardStyle = (item) => {
    switch (item.topic) {
      case "confession":
        return "bg-purple-50 border-purple-200";
      case "rant":
        return "bg-red-50 border-red-200";
      case "thought":
        return "bg-green-50 border-green-200";
      case "question":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getTypeIcon = (topic) => {
    switch (topic) {
      case "confession":
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case "rant":
        return <Zap className="w-4 h-4 text-red-500" />;
      case "thought":
        return <Lightbulb className="w-4 h-4 text-green-500" />;
      case "question":
        return <HelpCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (topic) => {
    switch (topic) {
      case "confession":
        return "Confession";
      case "rant":
        return "Rant";
      case "thought":
        return "Thought";
      case "question":
        return "Question";
      default:
        return null;
    }
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "public":
        return <Globe className="w-3 h-3 text-gray-500" />;
      case "private":
        return <Users className="w-3 h-3 text-gray-500" />;
      case "hidden":
        return <Lock className="w-3 h-3 text-gray-500" />;
      default:
        return <Globe className="w-3 h-3 text-gray-500" />;
    }
  };

  const PostCard = ({ item, isModal = false }) => {
    if (!item) return null;
    
    const cardStyle = getCardStyle(item);
    const typeIcon = getTypeIcon(item.topic);
    const typeLabel = getTypeLabel(item.topic);
    const privacyIcon = getPrivacyIcon(item.privacy);

    return (
      <div className={`border rounded-lg shadow-sm ${cardStyle} relative`}>
        {/* Card Header */}
        <div className="px-4 py-3 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center overflow-hidden">
                {item.user?.profile ? (
                  <img 
                    src={item.user.profile} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.className = 'w-5 h-5 text-white';
                      e.target.outerHTML = '<User className="w-5 h-5 text-white" />';
                    }}
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {item.user ? (
                    <>
                      <span className="font-medium text-gray-900">
                        {item.user.first_name} {item.user.last_name}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-gray-900">Anonymous</span>
                  )}
                  {typeIcon && (
                    <div className="flex items-center gap-1">
                      {typeIcon}
                      <span className="text-xs text-gray-500">{typeLabel}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.created_at ? new Date(item.created_at).toLocaleString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Just now'}</span>
                  {privacyIcon}
                </div>
              </div>
            </div>

            {/* Action Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenus({ ...showMenus, [item.id]: !showMenus[item.id] });
                }}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
              {showMenus[item.id] && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-32"
                >
                  {!item.isOwn && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuAction(item.id, "report");
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Flag className="w-3 h-3" />
                        Report
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuAction(item.id, "unsee");
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <EyeOff className="w-3 h-3" />
                        Unsee
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction(item.id, "bookmark");
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Bookmark className="w-3 h-3" />
                    Bookmark
                  </button>
                  {item.isOwn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuAction(item.id, "delete");
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="px-4 pb-4">
          {item.prompt && (
            <div className="mb-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Prompt</span>
              </div>
              <p className="text-indigo-800 text-sm">{item.prompt}</p>
            </div>
          )}
          <div
            className={`${
              item.background_style
                ? `bg-gradient-to-br ${item.background_style} text-white p-4 rounded-lg`
                : "text-gray-800"
            }`}
          >
            <p className={`leading-relaxed ${isModal ? "text-base" : "text-sm"}`}>
              <MarkDown
                content={
                  isModal
                    ? item.description
                    : item.description?.length > 150
                    ? `${item.description.substring(0, 150)}...`
                    : item.description
                }
              />
            </p>
          </div>
          
          {/* Question specific UI */}
          {item.topic === "question" && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags?.map((tag, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mood Emoji in bottom right */}
        {item.mood && (
          <div className="absolute bottom-2 right-2">
            <img 
              src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiCode(item.mood)}/512.png`} 
              alt={item.mood}
              className="w-6 h-6"
              onError={(e) => {
                e.target.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.png`;
              }}
            />
          </div>
        )}
      </div>
    );
  };

  if (loading && (!feedItems || feedItems.length === 0)) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {error ? (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="bg-white border border-red-300 shadow-xl rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              Looks like you're offline and you try to reload the page. Please go online and refresh the page again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition transform hover:scale-105"
            >
              Retry
            </button>
          </div>
        </div>
      ) : !feedItems || feedItems.length === 0 ? (
        // ⚪ Empty Feed UI
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="bg-white border border-yellow-300 shadow-xl rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
            <div className="text-yellow-500 text-4xl mb-2">📭</div>
            <h2 className="text-xl font-semibold mb-2">No Posts Available</h2>
            <p className="text-gray-600 mb-6">
              There’s nothing here yet. Be the first to post or try refreshing!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => fetchPosts()}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
              >
                Refresh
              </button>
              <button
                onClick={() => window.location.href = '/post'}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
              >
                Create Post
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Feed Items */}
          <div className="px-4 py-6 space-y-4">
            {feedItems.map((item) => (
              <motion.div 
                key={item.id} 
                onClick={() => openPostModal(item)}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PostCard item={item} />
              </motion.div>
            ))}

            {pagination.has_next && (
              <div className="text-center py-8">
                <motion.button 
                  onClick={handleLoadMore}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TrendingUp className="w-4 h-4" />
                  {loading ? 'Loading...' : 'Load More'}
                </motion.button>
              </div>
            )}
          </div>

          {/* Post Modal */}
          <AnimatePresence>
            {selectedPost && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 400 }}
                  className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Post Details</h2>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-md"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="p-4">
                      <PostCard item={selectedPost} isModal={true} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Bottom spacing for mobile nav */}
      <div className="h-20" />
      <Navbar/>
    </div>
  );
}
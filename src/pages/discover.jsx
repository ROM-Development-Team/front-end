import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  MessageCircle,
  Zap,
  Lightbulb,
  Heart,
  TrendingUp,
  User,
  Loader2,
  HelpCircle,
  Brain,
  Copy,
  Check,
} from "lucide-react";
import SEModal from "../components/se-modal";
import Navbar from "../components/navBar";
import { MarkDown } from "../utils/markdown";
import { discoverContent } from "../../api/accountSettings";
import { moodEmojis } from "../utils/moodEmojis";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [discoverData, setDiscoverData] = useState({
    users: [],
    posts: [],
    pagination: {}
  });
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    show: false,
    title: "",
    message: ""
  });
  const [copiedUsername, setCopiedUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscoverData();
  }, []);

  const fetchDiscoverData = async (search = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.user_id || !user?.token) {
        console.warn("User not found. Redirecting...");
        navigate("/");
        return;
      }
      const userId = user?.user_id;
      const result = await discoverContent(user.token, {
        userId,
        search,
        page: 1,
        limit: 5
      });

      if (result.status === 'success') {
        setDiscoverData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setIsSearching(searchQuery.length > 0);
    fetchDiscoverData(searchQuery);
  };

  const handlePostAction = (type, promptText = null) => {
    navigate('/post', { 
      state: { 
        topic: type,
        prompt: promptText 
      } 
    });
  };

  const copyUsername = async (username) => {
    try {
      await navigator.clipboard.writeText(`https://rantonme.netlify.app/${username}`);
      setCopiedUsername(`https://rantonme.netlify.app/${username}`);
      setModalState({
        show: true,
        title: "Rant Link Copied!",
        message: `You can use this link to send anonymous messages on ${username}.`
      });
      setTimeout(() => setCopiedUsername(null), 2000);
    } catch (err) {
      setModalState({
        show: true,
        title: "Error",
        message: "Failed to copy username"
      });
    }
  };

  const getMoodColor = (mood) => {
    if (!mood) return 'bg-gray-100';
    
    const moodLower = mood.toLowerCase();
    
    if (moodLower.includes('happy') || moodLower.includes('joy') || 
        moodLower.includes('excite') || moodLower.includes('cheer')) {
      return 'bg-yellow-100';
    }
    if (moodLower.includes('sad') || moodLower.includes('lonely') || 
        moodLower.includes('grief') || moodLower.includes('heartbroken')) {
      return 'bg-blue-100';
    }
    if (moodLower.includes('angry') || moodLower.includes('rage') || 
        moodLower.includes('frustrat') || moodLower.includes('annoy')) {
      return 'bg-red-100';
    }
    if (moodLower.includes('calm') || moodLower.includes('relax') || 
        moodLower.includes('peace')) {
      return 'bg-green-100';
    }
    if (moodLower.includes('anxious') || moodLower.includes('worri') || 
        moodLower.includes('stress') || moodLower.includes('fear')) {
      return 'bg-purple-100';
    }
    
    return 'bg-gray-100';
  };

  const getEmojiCode = (mood) => {
    if (!mood) return moodEmojis.happy;
    
    const moodLower = mood.toLowerCase();
    
    // Find the closest matching mood
    for (const [key, value] of Object.entries(moodEmojis)) {
      if (moodLower.includes(key)) {
        return value;
      }
    }
    
    return moodEmojis.happy; // default
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, show: false }));
  };

  // Filter posts by topic for different sections
  const confessionPosts = discoverData.posts.filter(post => post.topic === 'confession');
  const rantPost = discoverData.posts.find(post => post.topic === 'rant');
  const promptPost = discoverData.posts.find(post => post.prompt);
  const thoughtPost = discoverData.posts.find(post => post.topic === 'thought');
  const questionPost = discoverData.posts.find(post => post.topic === 'question');

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* SEModal for notifications */}
      <SEModal 
        show={modalState.show} 
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
          </div>
          {/* Search Bar */}
          <div className="relative flex gap-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-md p-2 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 py-2 whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Suggested Users Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
          <div className="p-4 pb-3 border-b border-gray-200">
            <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
              <Users className="w-5 h-5 text-orange-500" />
              {isSearching ? 'Search Results' : 'Suggested Users'}
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              </div>
            ) : discoverData.users.length > 0 ? (
              discoverData.users.map((user) => (
                <div
                  key={user.username}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
                        {user.profile ? (
                          <img 
                            src={user.profile} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <div className="text-sm text-gray-600">
                        {user.mood && (
                          <div className={`${getMoodColor(user.mood)} rounded-full px-2 py-1 inline-flex items-center mt-1`}>
                            <img
                              src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiCode(user.mood)}/512.gif`}
                              alt={user.mood}
                              className="w-4 h-4 mr-1"
                              onError={(e) => {
                                e.target.src = `https://fonts.gstatic.com/s/e/notoemoji/latest/${moodEmojis.happy}/512.gif`;
                              }}
                            />
                            <span className="text-xs">{user.mood}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyUsername(user.username)}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-2 py-1 text-sm flex items-center gap-1"
                  >
                    {copiedUsername === user.username ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                {isSearching ? 'No users found' : 'No suggested users available'}
              </p>
            )}
          </div>
        </div>

        {/* Only show content cards when not searching */}
        {!isSearching && (
          <>
            {/* Confession Circle Card */}
            {confessionPosts.length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 shadow-sm rounded-lg">
                <div className="p-4 pb-3 border-b border-orange-200">
                  <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                    Confession Circle
                    <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                      Live
                    </span>
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {confessionPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="p-3 rounded-lg bg-white border border-orange-100 shadow-sm"
                    >
                      <p className="text-gray-700 text-sm mb-2">
                        <MarkDown
                          content={
                            post.description && post.description.length > 500
                              ? post.description.substring(0, 500) + '...'
                              : post.description
                          }
                        />
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{post.mood}</span>
                        <span>{new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => handlePostAction('confession')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 mt-2"
                  >
                    Join Circle
                  </button>
                </div>
              </div>
            )}

            {/* Rant of the Day Card */}
            {rantPost && (
              <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 shadow-sm rounded-lg">
                <div className="p-4 pb-3 border-b border-red-200">
                  <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
                    <Zap className="w-5 h-5 text-red-500" />
                    Rant of the Day
                    <TrendingUp className="w-4 h-4 text-red-500 ml-auto" />
                  </h2>
                </div>
                <div className="p-4">
                  <div className="p-4 rounded-lg bg-white border border-red-100 shadow-sm mb-4">
                    <p className="text-gray-700 text-sm mb-3">
                      <MarkDown
                        content={
                          rantPost.description && rantPost.description.length > 500
                            ? rantPost.description.substring(0, 500) + '...'
                            : rantPost.description
                        }
                      />
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>@{rantPost.user?.username || 'anonymous'}</span>
                      <span>{rantPost.mood}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePostAction('rant')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2"
                  >
                    Share Your Rant
                  </button>
                </div>
              </div>
            )}

            {/* Question of the Day Card */}
            {questionPost && (
              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 shadow-sm rounded-lg">
                <div className="p-4 pb-3 border-b border-purple-200">
                  <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
                    <HelpCircle className="w-5 h-5 text-purple-500" />
                    Question of the Day
                  </h2>
                </div>
                <div className="p-4">
                  <div className="p-4 rounded-lg bg-white border border-purple-100 shadow-sm mb-4">
                    <p className="text-purple-700 text-sm font-medium mb-2">
                      <MarkDown
                        content={
                          questionPost.description && questionPost.description.length > 500
                            ? questionPost.description.substring(0, 500) + '...'
                            : questionPost.description
                        }
                      />
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>@{questionPost.user?.username || 'anonymous'}</span>
                      <span>{questionPost.mood}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePostAction('question')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2"
                  >
                    Answer Question
                  </button>
                </div>
              </div>
            )}

            {/* Thought of the Day Card */}
            {thoughtPost && (
              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 shadow-sm rounded-lg">
                <div className="p-4 pb-3 border-b border-indigo-200">
                  <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
                    <Brain className="w-5 h-5 text-indigo-500" />
                    Thought of the Day
                  </h2>
                </div>
                <div className="p-4">
                  <div className="p-4 rounded-lg bg-white border border-indigo-100 shadow-sm mb-4">
                    <p className="text-indigo-700 text-sm italic mb-2">
                      <MarkDown
                        content={
                          thoughtPost.description && thoughtPost.description.length > 500
                            ? thoughtPost.description.substring(0, 500) + '...'
                            : thoughtPost.description
                        }
                      />
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>@{thoughtPost.user?.username || 'anonymous'}</span>
                      <span>{thoughtPost.mood}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePostAction('thought')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2"
                  >
                    Share Your Thought
                  </button>
                </div>
              </div>
            )}

            {/* Prompt Generator Card */}
            {promptPost && (
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-sm rounded-lg">
                <div className="p-4 pb-3 border-b border-blue-200">
                  <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
                    <Lightbulb className="w-5 h-5 text-blue-500" />
                    "Unsaid" Prompt Generator
                  </h2>
                </div>
                <div className="p-4">
                  <div className="p-4 rounded-lg bg-white border border-blue-100 shadow-sm mb-4">
                    <p className="text-blue-700 text-sm italic font-medium">"{promptPost.prompt}"</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePostAction('prompt', promptPost?.prompt || currentPrompt)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 flex items-center justify-center"
                    >
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mood Matcher Card */}
            {/* <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 shadow-sm rounded-lg">
              <div className="p-4 pb-3 border-b border-green-200">
                <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
                  <Heart className="w-5 h-5 text-green-500" />
                  Mood Matcher
                </h2>
              </div>
              <div className="p-4">
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm mb-2">Your current mood vibe:</p>
                  <div className="inline-block px-4 py-2 rounded-full bg-green-100 border border-green-200">
                    <span className="text-green-700 font-medium">mood</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-md py-2"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div> */}
          </>
        )}
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20" />
      <Navbar/>
    </div>
  );
}
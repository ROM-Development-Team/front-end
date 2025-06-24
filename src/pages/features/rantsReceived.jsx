import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import Navbar from "../../components/navBar";
import RantViewModal from "../../components/rantModal";
import LoadingScreen from "../../components/loadingScreen";
import StatusMessage from "../../utils/statusMessage";
import { getRantInbox } from "../../../api/rantInbox";

const RantsReceived = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedRant, setSelectedRant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [rants, setRants] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const loadRants = async (page = pagination.page, forceRefresh = false) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.user_id || !user.token) {
        throw new Error("User authentication data not found");
      }

      const result = await getRantInbox(
        user.user_id, 
        user.token,
        page, 
        pagination.limit,
        activeSearch,
        forceRefresh
      );
      
      if (result.status === "success") {
        setRants(result.data.rants || []);
        setPagination({
          page: result.data.page || page,
          limit: result.data.limit || pagination.limit,
          total: result.data.total || 0,
          totalPages: result.data.totalPages || 1
        });
      } else {
        throw new Error(result.message || "Failed to load rants");
      }
    } catch (err) {
      console.error("Error loading rants:", err);
      setError({
        title: "Error Loading Rants",
        message: err.message || "Couldn't load your rants. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRants();
  }, [activeSearch]);

  const handleSearch = () => {
    setActiveSearch(searchQuery);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      loadRants(newPage); // Load data for the new page
    }
  };

  const handleDeleteRant = (deletedRantId) => {
    setRants(prev => prev.filter(r => r.id !== deletedRantId));
    loadRants();
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp?._seconds) return "Just now";
    const date = new Date(timestamp._seconds * 1000);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)} hour${diff > 7200 ? 's' : ''} ago`;
    if (diff < 2592000) return `${Math.floor(diff/86400)} day${diff > 172800 ? 's' : ''} ago`;
    if (diff < 31536000) return `${Math.floor(diff/2592000)} month${diff > 5184000 ? 's' : ''} ago`;
    return `${Math.floor(diff/31536000)} year${diff > 63072000 ? 's' : ''} ago`;
  };

  const filteredRants = rants.filter(rant => {
    const matchesFilter = filter === "all" || 
      (filter === "viewed" && rant.read) || 
      (filter === "unviewed" && !rant.read);
    return matchesFilter;
  });

  const unviewedCount = rants.filter(rant => !rant.read).length;

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <StatusMessage
        type="error"
        title={error.title}
        message={error.message}
        primaryAction={{
          label: "Refresh",
          icon: <RefreshCw size={16} />,
          action: () => loadRants()
        }}
        secondaryAction={{
          label: "Go Home",
          action: () => navigate("/")
        }}
      />
    );
  }

  return (
    <>
      <div className="relative max-w-4xl mx-auto p-4 md:p-8 pb-28">
        <div className="flex items-center space-x-4 mb-6 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 shadow">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h3 className="text-lg font-semibold text-white">Rants Received</h3>
          <div className="ml-auto flex items-center space-x-2">
            <button 
              onClick={() => loadRants(pagination.page, true)}
              className="p-1 text-white hover:bg-white/20 rounded-full"
            >
              <RefreshCw size={18} />
            </button>
            {unviewedCount > 0 && (
              <span className="bg-white text-orange-500 text-xs font-bold px-2 py-1 rounded-full">
                {unviewedCount} new
              </span>
            )}
          </div>
        </div>

        {selectedRant && (
          <RantViewModal 
            rant={selectedRant} 
            onClose={() => {
              if (!selectedRant.read) {
                loadRants();
              }
              setSelectedRant(null);
            }}
            onDelete={handleDeleteRant}
            onRefresh={loadRants}
          />
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-1 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Search size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "all", label: "All", count: rants.length },
              { key: "unviewed", label: "Unread", count: unviewedCount },
              { key: "viewed", label: "Read", count: rants.length - unviewedCount },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`flex items-center justify-between px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  filter === filterOption.key
                    ? "bg-white text-orange-600 border border-orange-500 shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span>{filterOption.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  filter === filterOption.key ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-700"
                }`}>
                  {filterOption.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 px-2 pb-4">
          {filteredRants.length > 0 ? (
            filteredRants.map((rant) => (
              <div
                key={rant.id}
                className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all duration-200 relative overflow-hidden ${
                  !rant.read 
                    ? "border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-white hover:from-orange-100" 
                    : "border border-gray-100 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedRant(rant)}
              >
                {!rant.read && <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>}

                <div className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        !rant.read ? "text-orange-600 bg-orange-100" : "text-gray-600 bg-gray-100"
                      }`}>
                        Anonymous
                      </span>
                      <div className="flex items-center gap-1.5">
                        {!rant.read ? <EyeOff size={12} className="text-orange-400" /> : <Eye size={12} className="text-gray-400" />}
                        <span className={`text-xs ${!rant.read ? "text-orange-500" : "text-gray-400"}`}>
                          {formatTimestamp(rant.created_at)}
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm mb-2 line-clamp-2 ${!rant.read ? "font-semibold text-gray-900" : "font-normal text-gray-800"}`}>
                      {rant.rant_text}
                    </p>

                    {rant.media && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-gray-100">
                        <img
                          src={rant.media}
                          alt="Message content"
                          className="w-full h-28 object-cover"
                          loading="lazy"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 text-xs ${!rant.read ? "text-orange-500" : "text-gray-500"}`}>
                          <span>{rant.device_info?.device_type === "mobile" ? "📱" : "💻"}</span>
                          <span>{rant.device_info?.device_type || 'Unknown'}</span>
                        </div>
                        <div className={`w-px h-3 ${!rant.read ? "bg-orange-200" : "bg-gray-200"}`}></div>
                        <div className={`flex items-center gap-1 text-xs ${!rant.read ? "text-orange-500" : "text-gray-500"}`}>
                          <span>🌐</span>
                          <span>{rant.device_info?.browser || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {filter === "unviewed" ? "No unread messages" : 
                 filter === "viewed" ? "No read messages" : 
                 "No messages found"}
              </h3>
              <p className="text-gray-500">
                {activeSearch ? "Try adjusting your search terms" : "You haven't received any messages matching this filter"}
              </p>
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 mb-10 space-x-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-2 rounded-full ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-orange-600 hover:bg-orange-50'}`}
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className={`p-2 rounded-full ${pagination.page >= pagination.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-orange-600 hover:bg-orange-50'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <Navbar />
    </>
  );
};

export default RantsReceived;
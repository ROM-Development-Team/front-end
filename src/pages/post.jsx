import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Loader2 } from "lucide-react";
import Navbar from "../components/navBar";
import PostTypeSelector from "./createPost/postTypes";
import TextEditor from "./createPost/TextEditor";
import BackgroundSelector from "./createPost/BackgroundSelector";
import MoodSelector from "./createPost/MoodSelector";
import PrivacySettings from "./createPost/PrivacySettings";
import { createPost } from "../../api/posts";
import SEModal from "../components/se-modal";

export default function PostRant() {
  const location = useLocation();
  const { topic, prompt } = location.state || {};
  const [postData, setPostData] = useState({
    text: "",
    image: null,
    mood: "",
    backgroundColor: "",
    postType: topic || "thought",
    privacy: "public",
    voiceNote: false,
  });
  const [selectedPrompt, setSelectedPrompt] = useState(prompt || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    type: "", // 'success' or 'error'
    message: "",
    onClose: () => {}
  });

  useEffect(() => {
    if (topic) {
      setPostData(prev => ({ ...prev, postType: topic }));
    }
    if (prompt) {
      setSelectedPrompt(prompt);
    }
  }, [topic, prompt]);

  const showModal = (type, message, onClose = () => {}) => {
    setModal({
      show: true,
      type,
      message,
      onClose
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, show: false }));
    modal.onClose();
  };

  const validateForm = () => {
    const errors = [];
    
    if (!postData.text.trim()) {
      errors.push("• Description is required");
    }
    
    if (!postData.mood) {
      errors.push("• Mood is required");
    }
    
    if (!postData.postType) {
      errors.push("• Post type is required");
    }

    return errors;
  };

  const handlePost = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      showModal('error', `Please complete all required fields:\n${validationErrors.join("\n")}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.user_id || !user?.token) {
        showModal('error', "Session expired. Please login again.");
        return;
      }

      const postPayload = {
        user_id: user.user_id,
        topic: postData.postType,
        prompt: selectedPrompt || null,
        description: postData.text,
        mood: postData.mood,
        privacy: postData.privacy,
        background_style: postData.backgroundColor,
      };

      const response = await createPost(postPayload, user.user_id, user.token);

      if (response.status === 'success') {
        showModal('success', "Post created successfully!", () => {
          // Reset form after modal closes
          setPostData({
            text: "",
            mood: "",
            backgroundColor: "",
            postType: "",
            privacy: "public",
          });
          setSelectedPrompt("");
        });
      } else {
        showModal('error', response.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Post creation error:", err);
      showModal('error', err.message || "An error occurred while creating the post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
            <button
              onClick={handlePost}
              disabled={isSubmitting || !postData.text.trim() || !postData.mood}
              className={`bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center justify-center ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <PostTypeSelector 
          postType={postData.postType} 
          setPostData={setPostData} 
        />

        <TextEditor 
          text={postData.text} 
          backgroundColor={postData.backgroundColor}
          setPostData={setPostData}
          selectedPrompt={selectedPrompt}
          setSelectedPrompt={setSelectedPrompt}
          postType={postData.postType}
        />

        <BackgroundSelector 
          backgroundColor={postData.backgroundColor}
          setPostData={setPostData}
          hasImage={!!postData.image}
        />

        {/* <MediaUploader 
          postData={postData}
          setPostData={setPostData}
        /> */}

        <MoodSelector 
          mood={postData.mood}
          setPostData={setPostData}
        />

        <PrivacySettings 
          privacy={postData.privacy}
          setPostData={setPostData}
        />
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20" />
      <Navbar/>

      {/* SEModal for notifications */}
      <SEModal
        show={modal.show}
        onClose={closeModal}
        title={modal.type === 'success' ? 'Success' : 'Error'}
        message={modal.message}
      />
    </div>
  );
}
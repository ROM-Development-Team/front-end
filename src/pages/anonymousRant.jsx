import { useState, useRef, useEffect } from "react";
import { getRantProfile } from "../../api/rant";
import StatusMessage from "../utils/statusMessage";
import SEModal from "../components/se-modal";

// Features
import { FloatingElements } from "./rants/floatingElements";
import { ThemeHeader } from "./rants/themeHeader";
import { GlobalAnimations } from "./rants/globalAnimations";
import { TextStyleSelector } from "./rants/textStyleSelector";
import { MessageInput } from "./rants/messageInput";
import { ImageUploader } from "./rants/imageUploader";
import { SubmitButton } from "./rants/submitButton";
import { PrivacyPromise } from "./rants/privacyPromise";
import { themes, backgroundPatterns, textStyles, interactiveIcons } from "./rants/themes";
import { SuccessMessage } from "./rants/successMessage";

// API
import { createRant } from "../../api/rantInbox";

const AnonymousRantForm = ({ username }) => {
  const [rantOwner, setRantOwner] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('anonymousRantFormColorTheme');
      return savedTheme ? parseInt(savedTheme) : 0;
    }
    return 0;
  });
  const [errorModal, setErrorModal] = useState({
    show: false,
    title: '',
    message: '',
  });
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [textStyle, setTextStyle] = useState("normal");
  const [backgroundPattern, setBackgroundPattern] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anonymousRantFormColorTheme', currentTheme.toString());
    }
  }, [currentTheme]);

  useEffect(() => {
    const fetchRantProfile = async () => {
      if (!username) {
        setProfileError('No username provided');
        setLoadingProfile(false);
        return;
      }
      
      setLoadingProfile(true);
      setProfileError(null);
      
      try {
        const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
        const result = await getRantProfile(cleanUsername);
        
        if (result.status === 'success') {
          setRantOwner({
            username: `@${result.data.username}`,
            name: `${result.data.first_name} ${result.data.last_name}`.trim(),
            avatar: result.data.profile || null,
          });
        } else {
          setProfileError(result.message || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Error fetching rant profile:', error);
        setProfileError('An unexpected error occurred');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchRantProfile();
  }, [username]);

  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  // Helper functions
  const createFloatingElement = () => {
    const randomIcon = interactiveIcons[Math.floor(Math.random() * interactiveIcons.length)];
    const newElement = {
      id: Date.now() + Math.random(),
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
      icon: randomIcon.icon,
      color: randomIcon.color,
    };
    setFloatingElements((prev) => [...prev, newElement]);

    setTimeout(() => {
      setFloatingElements((prev) => prev.filter((el) => el.id !== newElement.id));
    }, 3000);
  };

  const handleInteraction = () => {
    if (Math.random() > 0.7) {
      createFloatingElement();
    }
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !rantOwner) return;

    setIsSubmitting(true);
    createFloatingElement();

    try {
      const cleanUsername = rantOwner.username.startsWith('@') 
        ? rantOwner.username.slice(1) 
        : rantOwner.username;

      const result = await createRant(
        cleanUsername,
        message,
        uploadedImage
      );

      if (result.status === 'success') {
        setIsSubmitted(true);
        setShowConfetti(true);
      } else {
        throw new Error(result.message || 'Failed to submit rant');
      }
    } catch (error) {
      setErrorModal({
        show: true,
        title: "Submission Failed",
        message: error.message || 'An error occurred while submitting your rant',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMessage("");
    setUploadedImage(null);
    setIsSubmitted(false);
    setShowConfetti(false);
  };

  const playSound = (type = 'default') => {
    if (!soundEnabled || typeof window === 'undefined') return;

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      const presets = {
        success: {
          freq: [784, 1046],
          duration: 0.8,
          type: 'sine',
          volume: 0.2
        },
        confetti: {
          freq: [659, 784, 1046],
          duration: 1.2,
          type: 'triangle',
          volume: 0.15,
          stagger: 0.1 
        },
        error: {
          freq: [392, 349], 
          duration: 0.4,
          type: 'sine',
          volume: 0.15
        },
        default: {
          freq: [440, 554], 
          duration: 0.3,
          type: 'sine',
          volume: 0.1
        }
      };

      const { freq, duration, type: waveType, volume, stagger } = presets[type] || presets.default;

      // Play single note or sequence
      if (!stagger) {
        // Single note
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = waveType;
        osc.frequency.value = Array.isArray(freq) ? freq[0] : freq;
        gain.gain.value = volume || 0.1;
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } else {
        // Play notes in sequence (for confetti)
        freq.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = waveType;
          osc.frequency.value = f;
          gain.gain.value = volume || 0.1;
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(ctx.currentTime + (i * stagger));
          osc.stop(ctx.currentTime + (i * stagger) + duration);
        });
      }
      
    } catch (error) {
      console.log("Sound error:", error);
    }
  };

  // Loading and error states
  if (loadingProfile) {
    return (
      <StatusMessage
        type="loading"
        title="Loading Profile"
        message={`Fetching details for ${username}...`}
        primaryAction={{ label: "Refresh", path: window.location.pathname }}
      />
    );
  }

  if (profileError) {
    return (
      <StatusMessage
        type="error"
        title="Profile Error"
        message={profileError}
        primaryAction={{ label: "Go Home", path: "/" }}
        secondaryAction={{ 
          label: "Try Again", 
          path: window.location.pathname 
        }}
      />
    );
  }

  if (!rantOwner) {
    return (
      <StatusMessage
        type="empty"
        title="Profile Not Found"
        message={`Couldn't find profile for @${username}`}
        primaryAction={{ label: "Go Home", path: "/" }}
      />
    );
  }

  if (isSubmitted) {
    return (
      <SuccessMessage 
        theme={themes[currentTheme]}
        showConfetti={showConfetti}
        rantOwner={rantOwner}
        resetForm={resetForm}
      />
    );
  }

  return (
    <div className={`min-h-screen ${backgroundPatterns[backgroundPattern]} relative overflow-hidden`}>
      <GlobalAnimations />
      
      <FloatingElements elements={floatingElements} />
      
      <ThemeHeader
        theme={themes[currentTheme]}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        setBackgroundPattern={setBackgroundPattern}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        playSound={playSound}
        handleInteraction={handleInteraction}
        rantOwner={rantOwner} 
      />

      <div className="max-w-md mx-auto p-6 -mt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextStyleSelector
            textStyles={textStyles}
            textStyle={textStyle}
            setTextStyle={setTextStyle}
            theme={themes[currentTheme]}
            handleInteraction={handleInteraction}
            playSound={playSound}
          />

          <MessageInput
            message={message}
            setMessage={setMessage}
            textareaRef={textareaRef}
            isTyping={isTyping}
            textStyle={textStyle}
            handleInteraction={handleInteraction}
            interactiveIcons={interactiveIcons}
          />

          <ImageUploader
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            fileInputRef={fileInputRef}
            dragActive={dragActive}
            setDragActive={setDragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleFileSelect={handleFileSelect}
            handleInteraction={handleInteraction}
            showConfetti={showConfetti}
            interactiveIcons={interactiveIcons}
          />

          <SubmitButton
            message={message}
            isSubmitting={isSubmitting}
            handleInteraction={handleInteraction}
            playSound={playSound}
            theme={themes[currentTheme]}
            currentTheme={currentTheme}
          />

          <PrivacyPromise />

          <SEModal
            isOpen={errorModal.show}
            onClose={() => setErrorModal(prev => ({...prev, show: false}))}
            title={errorModal.title}
            message={errorModal.message}
            actions={[
              {
                label: "Try Again",
                action: () => setErrorModal(prev => ({...prev, show: false})),
                variant: "primary",
              },
              {
                label: "Go Home",
                action: () => window.location.href = "/",
                variant: "secondary",
              }
            ]}
          />
        </form>
      </div>
    </div>
  );
};

export default AnonymousRantForm;
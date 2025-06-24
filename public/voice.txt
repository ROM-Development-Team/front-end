import { useState, useRef, useEffect } from "react";
import { Bot, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SEModal from "../../components/se-modal";
import { VoiceSelector } from "../voice/voiceSelector";
import { ConnectionRings } from "../voice/connectionRings.";
import { MainButton } from "../voice/mainButton";
import { StatusIndicator } from "../voice/statusIndicator";
import { ControlButtons } from "../voice/controlButtons";
import { 
  SpeakingDisplay, 
  ListeningDisplay, 
  ProcessingDisplay 
} from "../voice/stateDisplays";

export default function RantVoiceAI() {
  const [appState, setAppState] = useState("idle");
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [aiVoiceLevel, setAiVoiceLevel] = useState(0);
  const [connectionPulse, setConnectionPulse] = useState(0);
  const [buttonScale, setButtonScale] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState("nova");
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [userInputHistory, setUserInputHistory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const audioRef = useRef(null);
  const voiceLevelIntervalRef = useRef();
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const isAnalyzerConnectedRef = useRef(false);
  const fallbackAnimationRef = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = '' };
  }, []);

  // Connection pulse animation
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setConnectionPulse((prev) => (prev + 1) % 3)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isConnected])

  // Initialize audio context and analyzer
  const initAudioAnalyzer = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 32;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }
  };

  // Handle voice level animation
  const updateVoiceLevel = () => {
    if (isAnalyzerConnectedRef.current && analyserRef.current && dataArrayRef.current) {
      try {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        const average = sum / dataArrayRef.current.length;
        setAiVoiceLevel(Math.min(100, average * 0.5));
      } catch (e) {
        isAnalyzerConnectedRef.current = false;
        startFallbackAnimation();
      }
    } else if (fallbackAnimationRef.current) {
      const baseLevel = 30 + Math.sin(Date.now() * 0.01) * 20;
      const variation = Math.random() * 40;
      setAiVoiceLevel(Math.max(10, Math.min(100, baseLevel + variation)));
    }
  };

  const startFallbackAnimation = () => {
    fallbackAnimationRef.current = true;
  };

  const stopFallbackAnimation = () => {
    fallbackAnimationRef.current = false;
  };

  // Setup audio analyzer when speaking
  useEffect(() => {
    if (appState === "speaking") {
      voiceLevelIntervalRef.current = setInterval(updateVoiceLevel, 100);
    } else {
      setAiVoiceLevel(0);
      clearInterval(voiceLevelIntervalRef.current);
      stopFallbackAnimation();
    }

    return () => {
      clearInterval(voiceLevelIntervalRef.current);
      stopFallbackAnimation();
    };
  }, [appState]);

  // Sync listening state with appState
  useEffect(() => {
    if (listening && appState !== "listening") {
      setAppState("listening");
    } else if (!listening && appState === "listening") {
      processTranscript(transcript); 
    }
  }, [listening]);

  const startConversation = () => {
    setIsConnected(true);
    setButtonScale(1.1);
    setTimeout(() => setButtonScale(1), 200);
    setAppState("idle");
  };

  const endConversation = () => {
    setIsConnected(false);
    setAppState("idle");
    resetTranscript();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    SpeechRecognition.stopListening();
    setButtonScale(1.1);
    setTimeout(() => setButtonScale(1), 200);
    isAnalyzerConnectedRef.current = false;
    stopFallbackAnimation();
  };

  const handleStartListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      setError({
        title: "Browser Not Supported",
        message: "Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari."
      });
      return;
    }
    if (!isMicrophoneAvailable) {
      setError({
        title: "Microphone Not Available",
        message: "Please check your microphone permissions and try again."
      });
      return;
    }

    resetTranscript();
    setAppState("listening");
    try {
      // TANGGALIN ANG CONTINUOUS TRUE
      await SpeechRecognition.startListening(); 
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setAppState("idle");
      setError({
        title: "Microphone Error",
        message: "Couldn't access microphone. Please check permissions."
      });
    }
  };

  const processTranscript = (text) => {
    if (!text.trim()) {
      setAppState("idle");
      return;
    }

    setAppState("processing");
    generateAIResponse(text);
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setAppState("processing");
    processTranscript(transcript);
  };

  const generateAIResponse = async (userInput) => {
    try {
      setUserInputHistory(prev => [...prev, userInput]);
      
      const systemPrompt = `
        You are an emotionally intelligent and knowledgeable assistant on a platform called "Rant On Me" — a safe space where users can express emotions, ask questions, or explore thoughts without fear of judgment.

        Your goals:
        - When the user expresses emotions (e.g., sadness, joy, loneliness, anger), respond with empathy, validation, and warmth.
        - When the user asks for information or expresses curiosity, provide clear, engaging, and friendly explanations — like a supportive friend.
        - Match your tone to the user's mood and language.
        - Never judge, lecture, or fix the user. Just listen, understand, and connect.
        - Avoid robotic or overly formal responses. Be natural, relatable, and human.

        You support both emotional well-being and intellectual curiosity.
        Always prioritize connection, safety, and emotional clarity.

        ---

        Here is the recent conversation history (if any). Use it to understand the context and emotional tone:

        ${userInputHistory.length > 0 
          ? userInputHistory.map((msg, i) => `Turn ${i + 1}: ${msg}`).join('\n') 
          : 'No previous conversation.'}

        ---

        Now respond to the user's current message, with empathy, clarity, and relevance:

        User: ${userInput}
      `;
      await playTTS(systemPrompt);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setAppState("idle");
      setError({
        title: "AI Error",
        message: "There was an error processing your request. Please try again."
      });
    }
  };

  const playTTS = async (text, voice = selectedVoice) => {
    try {
      const encodedText = encodeURIComponent(text);
      const url = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}`;
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;

      audio.onended = () => {
        clearInterval(voiceLevelIntervalRef.current);
        setAppState("idle");
        if (isConnected) {
          setTimeout(() => handleStartListening(), 500);
        }
      };

      audio.onerror = (e) => {
        console.error('Audio error:', e);
        clearInterval(voiceLevelIntervalRef.current);
        setAppState("idle");
        setError({
          title: "Audio Error",
          message: "Couldn't play the AI response. Please try again."
        });
      };

      try {
        await audio.play();
        setAppState("speaking");
        
        try {
          initAudioAnalyzer();
          if (audioContextRef.current && analyserRef.current) {
            const source = audioContextRef.current.createMediaElementSource(audio);
            source.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
            isAnalyzerConnectedRef.current = true;
          }
        } catch (analyzerError) {
          console.warn("Audio analyzer connection failed:", analyzerError);
          isAnalyzerConnectedRef.current = false;
          startFallbackAnimation();
        }
      } catch (playError) {
        console.error('Initial play failed:', playError);
        startFallbackAnimation();
        
        setError({
          title: "Playback Requires Interaction",
          message: "Please click the play button to start audio."
        });
        
        const playButton = document.createElement('button');
        playButton.style.display = 'none';
        playButton.textContent = 'Play';
        playButton.onclick = async () => {
          try {
            await audio.play();
            setAppState("speaking");
            document.body.removeChild(playButton);
            setError(null);
          } catch (e) {
            console.error('Fallback play failed:', e);
            setAppState("idle");
            setError({
              title: "Playback Failed",
              message: "Couldn't play the audio response."
            });
          }
        };
        document.body.appendChild(playButton);
        playButton.click();
      }
    } catch (error) {
      console.error('TTS setup error:', error);
      setAppState("idle");
      setError({
        title: "Voice Error",
        message: error.message || "There was an error generating the voice response."
      });
    }
  };

  const handleStopAI = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAppState("idle");
    setTimeout(() => handleStartListening(), 500);
  };

  const handleToggleConversation = () => {
    setButtonScale(1.1);
    setTimeout(() => setButtonScale(1), 200);

    if (appState === "idle") {
      handleStartListening(); 
    } else if (appState === "listening") {
      handleStopListening(); 
    } else if (appState === "speaking") {
      handleStopAI(); 
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-white">
        <div className="p-6 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Browser Not Supported</h2>
          <p className="text-gray-700 mb-4">
            Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-white via-orange-50/30 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:bg-gray-100 rounded-md p-2 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
                {isConnected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">Rant Voice AI</h1>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      isConnected ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm text-gray-500">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <VoiceSelector
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
                showVoiceMenu={showVoiceMenu}
                setShowVoiceMenu={setShowVoiceMenu}
                isMuted={isMuted}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 relative">
        <ConnectionRings isConnected={isConnected} connectionPulse={connectionPulse} />

        {/* State-specific UI */}
        {appState === "speaking" && (
          <SpeakingDisplay aiVoiceLevel={aiVoiceLevel} appState={appState} />
        )}

        {appState === "listening" && (
          <ListeningDisplay transcript={transcript} />
        )}

        {appState === "processing" && (
          <ProcessingDisplay transcript={transcript} />
        )}

        <MainButton 
          isConnected={isConnected} 
          appState={appState} 
          buttonScale={buttonScale} 
          startConversation={startConversation} 
        />

        <StatusIndicator isConnected={isConnected} appState={appState} />

        <ControlButtons 
          isConnected={isConnected} 
          appState={appState} 
          handleToggleConversation={handleToggleConversation} 
          endConversation={endConversation} 
        />
      </div>

      {/* Microphone permission error */}
      {!isMicrophoneAvailable && isConnected && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center px-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-3 w-full max-w-md">
            <div className="flex items-start">
              <svg className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-red-700 ml-2">
                Microphone access is blocked. Please allow microphone permissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      <SEModal 
        show={!!error}
        onClose={() => setError(null)}
        title={error?.title || "Error"}
        message={error?.message || "An unknown error occurred"}
      />
    </div>
  );
}
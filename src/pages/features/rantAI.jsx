import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatHeader } from "../ai/chatHeader";
import { Message } from "../ai/message";
import { SuggestedPrompts } from "../ai/suggestedPrompt";
import { MessageInput } from "../ai/messageInput";
import { TypingIndicator } from "../ai/typingIndicator";
import { 
  detectIntent, 
  generateTextResponse, 
  generateImage 
} from "../ai/generation";

export default function RantAI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hey there! I'm Rant AI, your personal AI companion. I'm here to listen to your rants, answer your questions, help you process thoughts, or even generate images to express what words can't capture. What's on your mind today?",
      timestamp: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const suggestedPrompts = [
    "I need to rant about my day",
    "Help me process my feelings",
    "Generate an image of my mood",
    "What's the meaning of life?",
    "I'm feeling overwhelmed",
    "Create art from my thoughts",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const MAX_MESSAGES = 100;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (messages.length >= MAX_MESSAGES) {
      const warningMessage = {
        id: Date.now(),
        type: "ai",
        content: "You've reached the maximum message limit (100). Please refresh the page to start a new conversation.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, warningMessage]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      if (updatedMessages.length >= MAX_MESSAGES) {
        const warningMessage = {
          id: Date.now() + 1,
          type: "ai",
          content: "You've reached the maximum message limit (100). Please refresh the page to start a new conversation.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages(prev => [...prev, warningMessage]);
        return;
      }

      const intent = await detectIntent(inputMessage);
      
      if (intent === "image") {
        const loadingMessage = {
          id: Date.now() + 1,
          type: "ai",
          content: "I'm creating an image based on your request...",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages(prev => [...prev, loadingMessage]);
        
        const imageUrl = await generateImage(inputMessage);
        
        setMessages(prev => [
          ...prev.slice(0, -1),
          {
            id: Date.now() + 2,
            type: "ai",
            content: "Here's a visual representation of your prompt:",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isImage: true,
            imageUrl: imageUrl,
          }
        ]);
      } else {
        const textResponse = await generateTextResponse(inputMessage, updatedMessages);
        
        const aiResponse = {
          id: Date.now() + 1,
          type: "ai",
          content: textResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInputMessage(prompt);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const regenerateResponse = async (messageId) => {
    if (messages.length >= MAX_MESSAGES) {
      const warningMessage = {
        id: Date.now(),
        type: "ai",
        content: "You've reached the maximum message limit (100). Please refresh the page to start a new conversation.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, warningMessage]);
      return;
    }

    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage.type === "user") {
        setIsTyping(true);
        
        try {
          const conversationHistory = messages.slice(0, messageIndex);
          const intent = await detectIntent(userMessage.content);
          
          if (intent === "image") {
            const imageUrl = await generateImage(userMessage.content);
            
            setMessages(prev => [
              ...prev.slice(0, messageIndex),
              {
                id: Date.now(),
                type: "ai",
                content: "Here's a visual representation of your prompt:",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isImage: true,
                imageUrl: imageUrl,
              }
            ]);
          } else {
            const textResponse = await generateTextResponse(userMessage.content, conversationHistory);
            
            setMessages(prev => [
              ...prev.slice(0, messageIndex),
              {
                id: Date.now(),
                type: "ai",
                content: textResponse,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }
            ]);
          }
        } catch (error) {
          console.error("Error regenerating response:", error);
          setMessages(prev => [
            ...prev.slice(0, messageIndex),
            {
              id: Date.now(),
              type: "ai",
              content: "Sorry, I couldn't regenerate the response. Please try again.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          ]);
        } finally {
          setIsTyping(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ChatHeader onBack={() => navigate(-1)} />
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onCopy={copyMessage}
              onRegenerate={regenerateResponse}
            />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length === 1 && (
        <SuggestedPrompts 
          prompts={suggestedPrompts} 
          onPromptSelect={handleSuggestedPrompt} 
        />
      )}

      <MessageInput
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        isTyping={isTyping}
        isRecording={isRecording}
        onToggleRecording={() => setIsRecording(!isRecording)}
        inputRef={textareaRef}
      />
    </div>
  );
}
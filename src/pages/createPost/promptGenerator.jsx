import { Sparkles } from "lucide-react";
import { useState } from "react";

export const PromptGenerator = ({ selectedPrompt, setSelectedPrompt }) => {
  const [isLoading, setIsLoading] = useState(false);

  const generatePrompt = async () => {
    setIsLoading(true);
    try {
      const templates = [
        "Generate exactly one thought-provoking journal prompt about self-reflection",
        "Provide one concise personal reflection question",
        "Create one direct journaling prompt about emotions or experiences",
        "Give one specific question for personal introspection",
        "Formulate one prompt for exploring inner thoughts"
      ];
      
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      // Add a timestamp or random parameter to make each request unique
      const timestamp = Date.now();
      const response = await fetch(
        `https://text.pollinations.ai/prompt/${encodeURIComponent(randomTemplate)}?direct=true&nocache=${timestamp}`
      );
      const data = await response.text();
      setSelectedPrompt(data.trim());
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      const fallbackPrompts = [
        "What's something you've never told anyone?",
        "If you could send a message to your past self, what would it be?",
        "What's keeping you awake at night?",
        "Describe your current mood in three words",
        "What would you do if no one was watching?"
      ];
      setSelectedPrompt(
        fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPrompt) return null;

  return (
    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
      <p className="text-sm text-orange-700 italic">💭 "{selectedPrompt}"</p>
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => setSelectedPrompt("")}
          className="text-orange-600 hover:bg-orange-100 text-sm px-2 py-1 rounded"
        >
          Clear
        </button>
        <button
          onClick={generatePrompt}
          disabled={isLoading}
          className="text-orange-600 hover:bg-orange-100 text-sm px-2 py-1 rounded flex items-center"
        >
          {isLoading ? 'Generating...' : (
            <>
              <Sparkles className="w-3 h-3 mr-1" />
              Generate AI Prompt
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export const PromptGeneratorButton = ({ setSelectedPrompt }) => {
  const [isLoading, setIsLoading] = useState(false);

  const generatePrompt = async () => {
    setIsLoading(true);
    try {
      const fallbackPrompts = [
        "Give me one interesting journal prompt"
      ];
      const response = await fetch(
        `https://text.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompts)}?direct=true&nocache=${timestamp}`
      );
      const data = await response.text();
      setSelectedPrompt(data.trim());
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      const fallbackPrompts = [
        "What's something you've never told anyone?",
        "If you could send a message to your past self, what would it be?",
        "What's keeping you awake at night?",
        "Describe your current mood in three words",
        "What would you do if no one was watching?"
      ];
      setSelectedPrompt(
        fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={generatePrompt}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
    >
      {isLoading ? 'Loading...' : (
        <>
          <Sparkles className="w-4 h-4 mr-1" />
          Get Prompt
        </>
      )}
    </button>
  );
};
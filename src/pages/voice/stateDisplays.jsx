import { Volume2, Mic, Loader2 } from "lucide-react";
import { DynamicWaveform } from "./dynamicWaveForm";

export const SpeakingDisplay = ({ aiVoiceLevel, appState }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-100 w-full max-w-md mb-4 transition-all duration-300">
    <div className="mb-2">
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center mb-2">
        <Volume2 className="w-6 h-6 text-white" />
      </div>
      <p className="text-md font-medium text-gray-800">AI is speaking</p>
      <p className="text-xs text-gray-600 mb-2">Volume: {Math.round(aiVoiceLevel)}%</p>
    </div>
    <DynamicWaveform level={aiVoiceLevel} isActive={appState === "speaking"} />
  </div>
);

export const ListeningDisplay = ({ transcript }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-purple-100 w-full max-w-md mb-4">
    <div className="mb-2">
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center mb-2">
        <Mic className="w-6 h-6 text-white" />
      </div>
      <p className="text-md font-medium text-gray-800">Speak now...</p>
      <div className="min-h-16 max-h-20 p-2 bg-gray-50 rounded-lg mt-2 overflow-y-auto">
        <p className="text-gray-800 text-sm whitespace-pre-wrap">
          {transcript || (
            <span className="inline-block w-2 h-4 bg-gray-400 align-middle animate-blink" />
          )}
        </p>
      </div>
    </div>
  </div>
);

export const ProcessingDisplay = ({ transcript }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-blue-100 w-full max-w-md mb-4">
    <div className="mb-2">
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center mb-2">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      </div>
      <p className="text-md font-medium text-gray-800">AI is processing</p>
      <div className="min-h-16 p-2 bg-gray-50 rounded-lg mt-2">
        <p className="text-gray-800 text-sm">You said: {transcript}</p>
      </div>
    </div>
  </div>
);
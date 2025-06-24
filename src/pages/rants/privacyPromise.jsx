import { AlertCircle } from "lucide-react";

export const PrivacyPromise = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_1.4s_forwards] hover:scale-105 transition-all duration-300">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 animate-[wiggle_2s_ease-in-out_infinite]">
          <AlertCircle size={16} className="text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-blue-800 mb-1 flex items-center space-x-2">
            <span>🔒 Privacy Promise</span>
          </h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Your message flies anonymously through the digital cosmos! We don't store any personal info that could
            identify you. Only basic device info for security. 🚀✨
          </p>
        </div>
      </div>
    </div>
  );
};
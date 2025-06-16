import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-red-400 rounded-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-red-400 rounded-2xl flex items-center justify-center shadow-sm">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You're trying to access a page that's not intended for you.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}

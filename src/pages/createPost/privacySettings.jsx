import { Globe, Users, Lock } from "lucide-react";

const privacyOptions = [
  { value: "public", label: "Public", desc: "Everyone", icon: Globe },
  { value: "private", label: "Private", desc: "Only You", icon: Users },
  { value: "hidden", label: "Hidden", desc: "Post anonymously", icon: Lock },
];

export default function PrivacySettings({ privacy, setPostData }) {
  const getPrivacyIcon = () => {
    switch (privacy) {
      case "public":
        return <Globe className="w-5 h-5 text-orange-500" />
      case "private":
        return <Users className="w-5 h-5 text-orange-500" />;
      case "hidden":
        return <Lock className="w-5 h-5 text-orange-500" />;
      default:
        return <Globe className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="p-4 pb-3 border-b border-gray-200 mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
          {getPrivacyIcon()}
          Who can see this?
        </h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {privacyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPostData(prev => ({ ...prev, privacy: option.value }))}
              className={`flex flex-col items-center gap-1 p-3 h-auto ${
                privacy === option.value
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } rounded-md`}
            >
              <option.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{option.label}</span>
              <span className="text-xs opacity-75">{option.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
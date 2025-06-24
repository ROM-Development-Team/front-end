import { Link } from "react-router-dom";
import { 
  Frown,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
  RefreshCw,
  Smile
} from "lucide-react";

const iconComponents = {
  error: AlertTriangle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
  locked: Lock,
  loading: RefreshCw,
  empty: Frown,
  happy: Smile
};

export default function StatusMessage({
  type = "empty",
  title = "No Data Available",
  message = "We couldn't find any records for this section.",
  primaryAction = { label: "Go Home", path: "/" },
  secondaryAction,
  icon: CustomIcon,
  iconBgColor = "bg-orange-400",
  iconPulseColor = "bg-orange-400",
  primaryButtonColor = "bg-orange-500 hover:bg-orange-600",
  secondaryButtonColor = "border-orange-500 text-orange-500 hover:bg-orange-50"
}) {
  const IconComponent = CustomIcon || iconComponents[type] || Frown;
  
  // Default colors based on type
  if (!CustomIcon) {
    switch(type) {
      case 'error':
        iconBgColor = "bg-red-400";
        iconPulseColor = "bg-red-400";
        primaryButtonColor = "bg-red-500 hover:bg-red-600";
        secondaryButtonColor = "border-red-500 text-red-500 hover:bg-red-50";
        break;
      case 'success':
        iconBgColor = "bg-green-400";
        iconPulseColor = "bg-green-400";
        primaryButtonColor = "bg-green-500 hover:bg-green-600";
        secondaryButtonColor = "border-green-500 text-green-500 hover:bg-green-50";
        break;
      case 'info':
        iconBgColor = "bg-blue-400";
        iconPulseColor = "bg-blue-400";
        primaryButtonColor = "bg-blue-500 hover:bg-blue-600";
        secondaryButtonColor = "border-blue-500 text-blue-500 hover:bg-blue-50";
        break;
      case 'locked':
        iconBgColor = "bg-purple-400";
        iconPulseColor = "bg-purple-400";
        primaryButtonColor = "bg-purple-500 hover:bg-purple-600";
        secondaryButtonColor = "border-purple-500 text-purple-500 hover:bg-purple-50";
        break;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className={`absolute inset-0 ${iconPulseColor} rounded-2xl opacity-20 ${type !== 'loading' ? 'animate-pulse' : ''}`}></div>
            <div className={`relative w-full h-full ${iconBgColor} rounded-2xl flex items-center justify-center shadow-sm`}>
              <IconComponent className={`w-8 h-8 text-white ${type === 'loading' ? 'animate-spin' : ''}`} />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Link
            to={primaryAction.path || "/"}
            className={`inline-block ${primaryButtonColor} text-white px-5 py-2 rounded-lg font-medium transition`}
          >
            {primaryAction.label}
          </Link>
          {secondaryAction && (
            <Link
              to={secondaryAction.path || "/"}
              className={`inline-block border ${secondaryButtonColor} px-5 py-2 rounded-lg font-medium transition`}
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
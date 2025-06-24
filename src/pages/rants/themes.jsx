import {
  Sparkles,
  Zap,
  Heart,
  Star,
  Flame,
  Coffee,
  Music,
} from "lucide-react";

// Constants
export const themes = [
  {
    name: "Neon Pulse",
    primary: "from-pink-500 via-purple-500 to-indigo-500",
    secondary: "bg-gradient-to-r from-pink-100 to-purple-100",
    accent: "text-pink-600",
    animation: "bg-gradient-to-r animate-gradient-x"
  },
  {
    name: "Electric Ocean",
    primary: "from-cyan-400 via-blue-500 to-purple-600",
    secondary: "bg-gradient-to-r from-cyan-100 to-blue-100",
    accent: "text-cyan-600",
    animation: "bg-gradient-to-r animate-gradient-x"
  },
  { 
    name: "Sunset Blaze", 
    primary: "from-yellow-400 via-red-500 to-pink-500",
    secondary: "bg-gradient-to-r from-yellow-100 to-red-100",
    accent: "text-orange-600",
    animation: "bg-gradient-to-r animate-gradient-x"
  },
  {
    name: "Mystic Forest",
    primary: "from-emerald-400 via-teal-500 to-blue-500",
    secondary: "bg-gradient-to-r from-emerald-100 to-teal-100",
    accent: "text-emerald-600",
    animation: "bg-gradient-to-r animate-gradient-x"
  },
  {
    name: "Galactic Dream",
    primary: "from-indigo-500 via-purple-500 to-pink-500",
    secondary: "bg-gradient-to-r from-indigo-100 to-purple-100",
    accent: "text-indigo-600",
    animation: "bg-gradient-to-r animate-gradient-x"
  },
  {
    name: "Cyberpunk",
    primary: "from-green-400 via-cyan-500 to-blue-500",
    secondary: "bg-gradient-to-r from-green-100 to-cyan-100",
    accent: "text-green-600",
    animation: "bg-gradient-to-r animate-gradient-x"
  },
];

export const backgroundPatterns = [
  "bg-white",
  "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 animate-gradient-x",
  "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 animate-gradient-x",
  "bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 animate-gradient-x",
];

export const textStyles = [
  { name: "Normal", class: "font-normal" },
  { name: "Bold", class: "font-bold" },
  { name: "Italic", class: "italic" },
  { name: "Fancy", class: "font-serif text-lg" },
];

export const interactiveIcons = [
  { icon: <Sparkles size={16} />, color: "text-yellow-500" },
  { icon: <Heart size={16} />, color: "text-pink-500" },
  { icon: <Star size={16} />, color: "text-blue-500" },
  { icon: <Flame size={16} />, color: "text-orange-500" },
  { icon: <Zap size={16} />, color: "text-purple-500" },
  { icon: <Coffee size={16} />, color: "text-amber-800" },
  { icon: <Music size={16} />, color: "text-green-500" },
];
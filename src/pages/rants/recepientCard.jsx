import { User, MessageSquare, Heart } from "lucide-react";

export const RecipientCard = ({ rantOwner, theme }) => {
  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards] hover:bg-white/30 transition-all duration-300 hover:scale-105">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center overflow-hidden animate-[glow_2s_ease-in-out_infinite]">
            {rantOwner.avatar ? (
              <img
                src={rantOwner.avatar}
                alt={rantOwner.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={24} className="text-white" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center animate-[wiggle_2s_ease-in-out_infinite]">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-xl">{rantOwner.name}</h3>
          <p className="opacity-90 text-sm">{rantOwner.username}</p>
          <div className="flex items-center space-x-2 mt-1">
            <MessageSquare size={14} className="opacity-75" />
            <span className="text-xs opacity-75">Ready for your message!</span>
            <Heart size={12} className="text-pink-300 animate-[wiggle_1s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
};
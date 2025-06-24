import { Camera, Sparkles, Upload, ImageIcon, X } from "lucide-react";

export const ImageUploader = ({
  uploadedImage,
  setUploadedImage,
  fileInputRef,
  dragActive,
  setDragActive,
  handleDrag,
  handleDrop,
  handleFileSelect,
  handleInteraction,
  showConfetti,
  interactiveIcons
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_1s_forwards]">
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
        <Camera size={16} />
        <span>Add Some Visual Magic</span>
        <Sparkles size={14} className="text-yellow-500 animate-[wiggle_1s_ease-in-out_infinite]" />
      </label>

      {uploadedImage ? (
        <div className="space-y-3">
          <div 
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-xl transition-all duration-300 group-hover:opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Click to replace image
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setUploadedImage(null);
              handleInteraction();
            }}
            className="w-full py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <X size={16} />
            <span>Remove Image</span>
          </button>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => {
                const size = Math.random() * 8 + 4;
                const color = [
                  'bg-orange-400',
                  'bg-yellow-400',
                  'bg-red-400',
                  'bg-blue-400',
                  'bg-green-400',
                  'bg-purple-400'
                ][Math.floor(Math.random() * 6)];
                
                return (
                  <div
                    key={i}
                    className={`absolute rounded-full ${color} animate-[confettiFall_3s_linear_forwards]`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-10px`,
                      width: `${size}px`,
                      height: `${size}px`,
                      animationDelay: `${Math.random() * 2}s`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                      opacity: 0.8
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group hover:scale-105 ${
            dragActive
              ? "border-orange-500 bg-orange-50 scale-105"
              : "border-gray-300 hover:border-orange-400 hover:bg-orange-25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => {
            fileInputRef.current?.click();
            handleInteraction();
          }}
        >
          <div className="flex flex-col items-center space-y-3">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                dragActive ? "bg-orange-200 animate-[wiggle_0.5s_ease-in-out_infinite]" : "bg-gray-100"
              }`}
            >
              {dragActive ? (
                <Upload size={32} className="text-orange-600" />
              ) : (
                <ImageIcon size={32} className="text-gray-400 group-hover:text-orange-500" />
              )}
            </div>
            <div>
              <p className="font-bold text-gray-700 text-lg">
                {dragActive ? "🎉 Drop it like it's hot!" : "📸 Add an image"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Drag & drop or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
            <div className="flex space-x-2 mt-2">
              {interactiveIcons.slice(0, 4).map((icon, i) => (
                <div
                  key={i}
                  className={`${icon.color} animate-[float_2s_ease-in-out_infinite] opacity-50 group-hover:opacity-100`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {icon.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        onChange={handleFileSelect} 
        className="hidden" 
      />
    </div>
  );
};
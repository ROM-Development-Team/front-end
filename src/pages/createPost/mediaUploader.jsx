import { Camera, Mic, Volume2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function MediaUploader({ postData, setPostData }) {
  const fileInputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPostData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPostData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    setPostData(prev => ({ ...prev, voiceNote: !prev.voiceNote }));
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="p-4 pb-3 border-b border-gray-200 mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
          <Camera className="w-5 h-5 text-orange-500" />
          Add Media
        </h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Image Upload */}
        <div>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border-dashed border-2 border-gray-300 h-20 rounded-md"
            >
              <div className="text-center">
                <Upload className="w-6 h-6 mx-auto mb-1" />
                <div className="text-sm">Upload Image</div>
                <div className="text-xs text-gray-500">JPG, PNG, GIF up to 10MB</div>
              </div>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Voice Note */}
        <button
          onClick={toggleRecording}
          className={`w-full h-16 ${
            isRecording ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } rounded-md`}
        >
          <div className="text-center">
            {isRecording ? (
              <Volume2 className="w-6 h-6 mx-auto mb-1" />
            ) : (
              <Mic className="w-6 h-6 mx-auto mb-1" />
            )}
            <div className="text-sm">{isRecording ? "Recording..." : "Add Voice Note"}</div>
            {postData.voiceNote && !isRecording && (
              <div className="text-xs text-green-600">Voice note added ✓</div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
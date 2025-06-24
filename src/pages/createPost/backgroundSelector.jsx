import { Palette } from "lucide-react";

const backgroundColors = [
  { name: "Void Black", value: "from-gray-900 to-black", textColor: "text-white" },
  { name: "Sunset Orange", value: "from-orange-400 to-red-500", textColor: "text-white" },
  { name: "Mystic Purple", value: "from-purple-500 to-indigo-600", textColor: "text-white" },
  { name: "Ocean Blue", value: "from-blue-400 to-blue-600", textColor: "text-white" },
  { name: "Forest Green", value: "from-green-400 to-green-600", textColor: "text-white" },
  { name: "Rose Gold", value: "from-pink-400 to-orange-400", textColor: "text-white" },
];

export default function BackgroundSelector({ backgroundColor, setPostData, hasImage }) {
  if (hasImage) return null;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="p-4 pb-3 border-b border-gray-200 mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-gray-900 font-semibold">
          <Palette className="w-5 h-5 text-orange-500" />
          Background Style
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPostData(prev => ({ ...prev, backgroundColor: "" }))}
            className={`p-3 h-16 border-2 ${
              !backgroundColor
                ? "border-orange-500 bg-white"
                : "border-gray-200 bg-white hover:bg-gray-50"
            } rounded-md`}
          >
            <div className="text-center">
              <div className="text-xs text-gray-600">Default</div>
            </div>
          </button>
          {backgroundColors.map((bg) => (
            <button
              key={bg.name}
              onClick={() => setPostData(prev => ({ ...prev, backgroundColor: bg.value }))}
              className={`p-3 h-16 bg-gradient-to-r ${bg.value} ${bg.textColor} border-2 ${
                backgroundColor === bg.value ? "border-orange-500" : "border-transparent"
              } rounded-md`}
            >
              <div className="text-center">
                <div className="text-xs">{bg.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
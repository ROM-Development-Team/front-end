import ReactMarkdown from "react-markdown";
import {
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from "lucide-react";

export const Message = ({ message, onCopy, onRegenerate }) => {
  // Define text color based on message type
  const textColorClass = message.type === "user" ? "text-white" : "text-gray-800";
  
  return (
    <div className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
      {message.type === "ai" && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${message.type === "user" ? "order-1" : ""}`}>
        <div
          className={`rounded-lg border ${
            message.type === "user"
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="p-4">
            <div className="space-y-3">
              {/* Remove className from ReactMarkdown and apply styles through components */}
              <ReactMarkdown 
                components={{
                  p: ({node, ...props}) => <p className={`mb-2 text-sm leading-relaxed ${textColorClass}`} {...props} />,
                  ul: ({node, ...props}) => <ul className={`list-disc pl-5 mb-2 text-sm leading-relaxed ${textColorClass}`} {...props} />,
                  ol: ({node, ...props}) => <ol className={`list-decimal pl-5 mb-2 text-sm leading-relaxed ${textColorClass}`} {...props} />,
                  li: ({node, ...props}) => <li className={`mb-1 text-sm leading-relaxed ${textColorClass}`} {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className={`border-l-4 border-gray-300 pl-4 italic mb-2 text-sm leading-relaxed ${textColorClass}`} {...props} />
                  ),
                  code: ({node, ...props}) => (
                    <code className={`bg-gray-100 px-1 py-0.5 rounded text-sm font-mono ${textColorClass}`} {...props} />
                  ),
                  pre: ({node, ...props}) => (
                    <pre className={`bg-gray-100 p-2 rounded text-sm font-mono overflow-x-auto mb-2 ${textColorClass}`} {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className={`text-orange-500 hover:underline ${textColorClass}`} {...props} />
                  ),
                  strong: ({node, ...props}) => (
                    <strong className={`font-semibold ${textColorClass}`} {...props} />
                  ),
                  em: ({node, ...props}) => (
                    <em className={`italic ${textColorClass}`} {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>

              {message.isImage && message.imageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={message.imageUrl}
                    alt="AI Generated"
                    className="w-full max-w-md h-auto"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`text-xs ${message.type === "user" ? "text-orange-100" : "text-gray-500"}`}>
                  {message.timestamp}
                </span>

                {message.type === "ai" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onCopy(message.content)}
                      className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0 flex items-center justify-center rounded-md hover:bg-gray-100"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0 flex items-center justify-center rounded-md hover:bg-gray-100">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0 flex items-center justify-center rounded-md hover:bg-gray-100">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRegenerate(message.id)}
                      className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0 flex items-center justify-center rounded-md hover:bg-gray-100"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {message.type === "user" && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};
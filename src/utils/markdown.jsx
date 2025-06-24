import ReactMarkdown from 'react-markdown';

export const MarkDown = ({ content }) => {
  return(
    <ReactMarkdown
      components={{
        p: ({ node, ...props }) => (
          <p className={`mb-3 text-[15px] leading-relaxed`} {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className={`list-disc pl-6 mb-3 text-[15px] leading-relaxed`} {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className={`list-decimal pl-6 mb-3 text-[15px] leading-relaxed`} {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className={`mb-1 text-[15px] leading-relaxed`} {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 pl-4 pr-2 py-2 italic rounded mb-3 text-[15px]"
            style={{
              borderColor: '#f97316',
              backgroundColor: '#fff7ed',
              color: '#9a3412',
              '--tw-dark-bg': '#7c2d12', 
              '--tw-dark-text': '#ffffff', 
            }}
            {...props}
          />
        ),

        code: ({ node, ...props }) => (
          <code
            className="px-1.5 py-1 rounded text-[14px] font-mono"
            style={{
              backgroundColor: '#f97316', 
              color: '#1f2937', 
              '--tw-dark-bg': '#27272a',
              '--tw-dark-text': '#ffffff',
            }}
            {...props}
          />
        ),

        pre: ({ node, ...props }) => (
          <pre
            className="p-4 rounded-lg text-[13px] font-mono overflow-x-auto mb-4"
            style={{
              backgroundColor: '#f97316',
              color: '#1f2937', 
              '--tw-dark-bg': '#18181b', 
              '--tw-dark-text': '#ffffff',
            }}
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a
            className={`text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 transition-colors duration-200`}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        strong: ({ node, ...props }) => (
          <strong className={`font-semibold`} {...props} />
        ),
        em: ({ node, ...props }) => (
          <em className={`italic`} {...props} />
        ),
        hr: () => (
          <hr className="my-4 border-t border-zinc-300 dark:border-zinc-700" />
        ),
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mb-3" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-semibold mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-medium mb-3" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatWindow = ({ messages, onSendMessage, loading, activeDataset }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden transition-colors">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center px-6 pb-20 max-w-2xl mx-auto w-full">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
               <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Ask about your data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 focus-text">
              Examples to get started:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
               {[
                 "How many total records are there?",
                 "Show me a breakdown by category",
                 "What are the top 5 highest values?",
                 "Compare group A with the rest"
               ].map((q, i) => (
                 <button 
                   key={i}
                   onClick={() => onSendMessage(q)}
                   className="text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all text-sm text-gray-600 dark:text-gray-300 group"
                 >
                   <span className="text-indigo-500 dark:text-indigo-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                   {q}
                 </button>
               ))}
            </div>
            
            {activeDataset?.columns && (
              <div className="mt-10">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Fields
                </h4>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {activeDataset.columns.map((col, i) => (
                    <span key={i} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-xs text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      <span>{col.name} <span className="text-gray-400 text-[10px] ml-0.5 font-mono">({col.type})</span></span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)
        )}
        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 p-3 w-full bg-slate-50/80 dark:bg-gray-800/80 rounded-2xl max-w-[80px]">
             <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
             <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        <div ref={bottomRef} className="h-2" />
      </div>
      <div className="flex-none">
        <ChatInput onSendMessage={onSendMessage} disabled={loading} activeDataset={activeDataset} />
      </div>
    </div>
  );
};
export default ChatWindow;

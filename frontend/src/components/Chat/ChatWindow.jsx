import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatWindow = ({ messages, onSendMessage, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
               <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">How can I help you analyze data today?</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md">Select a dataset and ask questions like "Show me sales by region in a pie chart" or "What is the distribution of revenue?".</p>
          </div>
        ) : (
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)
        )}
        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 p-4 w-full bg-slate-50/50 rounded-2xl max-w-[100px]">
             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
      <ChatInput onSendMessage={onSendMessage} disabled={loading} />
    </div>
  );
};
export default ChatWindow;

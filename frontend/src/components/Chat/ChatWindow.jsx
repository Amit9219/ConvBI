import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatWindow = ({ messages, onSendMessage, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
               <span className="text-xl">✨</span>
            </div>
            <h3 className="text-base font-semibold text-slate-800">Ready to align your data</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-[250px]">Select a dataset and ask questions to generate instant insights on the right.</p>
          </div>
        ) : (
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)
        )}
        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 p-3 w-full bg-slate-50/80 rounded-2xl max-w-[80px]">
             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        <div ref={bottomRef} className="h-2" />
      </div>
      <div className="p-4 bg-white border-t border-slate-100">
        <ChatInput onSendMessage={onSendMessage} disabled={loading} />
      </div>
    </div>
  );
};
export default ChatWindow;

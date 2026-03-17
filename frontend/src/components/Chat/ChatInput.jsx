import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-100 z-10 w-full relative">
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      <form onSubmit={handleSubmit} className="flex relative max-w-4xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Ask a question about your data..."
          className="w-full bg-slate-50 border border-slate-200 rounded-full pl-6 pr-16 py-4 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all text-[15px] outline-none disabled:bg-slate-100 disabled:text-slate-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
        >
          <SendHorizonal size={20} className={input.trim() && !disabled ? "translate-x-[1px] transition-transform" : ""} />
        </button>
      </form>
    </div>
  );
};
export default ChatInput;

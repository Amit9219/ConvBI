import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled, activeDataset }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 z-10 w-full relative transition-colors">
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none"></div>
      
      {/* Smart Query Chips */}
      {activeDataset?.columns && (
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto pb-3 scroll-smooth items-center hide-scrollbar-on-mobile" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           <span className="text-[10px] font-bold uppercase text-gray-400 whitespace-nowrap mr-1 shrink-0">Suggestions:</span>
           {[
             { label: "Total Count", query: "How many total records are there?" },
             { label: "Top Row Sample", query: "Show me a table of the data" },
             { label: "Data Distribution", query: "Show a pie chart breakdown by category" },
             { label: "Side-by-Side Comparison", query: "Compare specific values with the rest" }
           ].map((chip) => (
             <button
               type="button"
               key={chip.label}
               onClick={() => onSendMessage(chip.query)}
               disabled={disabled}
               className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 hover:bg-indigo-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all active:scale-95 disabled:opacity-50 shrink-0"
             >
               {chip.label}
             </button>
           ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex relative max-w-4xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Ask a question about your data..."
          className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-full pl-6 pr-16 py-4 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-black transition-all text-[15px] outline-none disabled:bg-gray-100 dark:disabled:bg-black disabled:text-gray-400 dark:text-white"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm active:scale-95"
        >
          <SendHorizonal size={20} className={input.trim() && !disabled ? "translate-x-[1px] transition-transform" : ""} />
        </button>
      </form>
    </div>
  );
};
export default ChatInput;

import { User, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ChartRenderer from '../Dashboard/ChartRenderer';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={twMerge(clsx("flex w-full group", isUser ? "justify-end" : "justify-start"))}>
      <div className={twMerge(clsx("flex w-full max-w-4xl space-x-3", isUser ? "flex-row-reverse space-x-reverse" : "flex-row"))}>
        <div className={twMerge(clsx(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm mt-1 ring-4 ring-gray-50 transition-all", 
          isUser ? "bg-gradient-to-tr from-indigo-600 to-indigo-500 dark:ring-black" : "bg-gradient-to-tr from-emerald-500 to-teal-400 dark:ring-black"
        ))}>
          {isUser ? <User size={14} /> : <Sparkles size={14} />}
        </div>
        <div className={twMerge(clsx(
          "px-4 py-3 shadow-sm w-full max-w-[90%] transition-colors duration-300", 
          isUser 
            ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm" 
            : "bg-white dark:bg-black text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-2xl rounded-tl-sm"
        ))}>
           <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
           {message.chartData && (
              <div className="mt-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 h-[300px]">
                 <ChartRenderer data={message.chartData} config={message.chartConfig} />
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;

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
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm mt-1 ring-4 ring-white", 
          isUser ? "bg-gradient-to-tr from-indigo-600 to-indigo-500" : "bg-gradient-to-tr from-emerald-500 to-teal-400"
        ))}>
          {isUser ? <User size={14} /> : <Sparkles size={14} />}
        </div>
        <div className={twMerge(clsx(
          "px-4 py-3 shadow-sm w-full max-w-[90%]", 
          isUser 
            ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm" 
            : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm"
        ))}>
           <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
           {message.chartData && (
              <div className="mt-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 h-[300px]">
                 <ChartRenderer data={message.chartData} config={message.chartConfig} />
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;

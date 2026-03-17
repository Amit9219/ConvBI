import { User, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ChartRenderer from '../Dashboard/ChartRenderer';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={twMerge(clsx("flex w-full group", isUser ? "justify-end" : "justify-start"))}>
      <div className={twMerge(clsx("flex w-full max-w-4xl space-x-4", isUser ? "flex-row-reverse space-x-reverse" : "flex-row"))}>
        <div className={twMerge(clsx(
          "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white shadow-sm mt-1 ring-4 ring-white", 
          isUser ? "bg-gradient-to-tr from-indigo-600 to-indigo-500" : "bg-gradient-to-tr from-emerald-500 to-teal-400"
        ))}>
          {isUser ? <User size={18} /> : <Sparkles size={18} />}
        </div>
        <div className={twMerge(clsx(
          "px-5 py-4 shadow-sm w-full", 
          isUser 
            ? "bg-indigo-600 text-white rounded-2xl rounded-tr-md" 
            : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-md"
        ))}>
           <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
           {message.chartData && (
              <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col h-[350px]">
                 <p className="text-[11px] font-bold tracking-wider text-slate-400 mb-2 uppercase">Generated {message.chartConfig?.chartType} Chart</p>
                 <div className="flex-1 w-full min-h-0">
                    <ChartRenderer data={message.chartData} config={message.chartConfig} />
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;

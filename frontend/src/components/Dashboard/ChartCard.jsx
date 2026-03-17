import ChartRenderer from './ChartRenderer';
import { Maximize2, Trash2 } from 'lucide-react';

const ChartCard = ({ title, data, config, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[400px] group transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-white text-sm truncate pr-4 capitalize transition-colors" title={title}>
          {title || `Generated ${config?.chartType || 'Data'} Chart`}
        </h3>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Expand">
            <Maximize2 size={16} />
          </button>
          {onDelete && (
            <button onClick={onDelete} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Remove">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 w-full pb-2">
         <ChartRenderer data={data} config={config} />
      </div>
    </div>
  );
};
export default ChartCard;

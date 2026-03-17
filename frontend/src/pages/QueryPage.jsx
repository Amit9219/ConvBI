import { useState, useEffect, useMemo, useRef, memo } from 'react';
import ChatWindow from '../components/Chat/ChatWindow';
import ChartRenderer from '../components/Dashboard/ChartRenderer';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Database, Terminal, BarChart2, LineChart, PieChart, Table as TableIcon, Layout, ArrowDown } from 'lucide-react';

const DashboardCard = memo(({ message }) => {
  const [activeChartType, setActiveChartType] = useState(message.chartConfig?.chartType || 'bar');
  
  const config = useMemo(() => ({
    ...message.chartConfig,
    chartType: activeChartType
  }), [message.chartConfig, activeChartType]);

  const chartOptions = [
    { id: 'bar', icon: BarChart2, label: 'Bar' },
    { id: 'line', icon: LineChart, label: 'Line' },
    { id: 'pie', icon: PieChart, label: 'Pie' },
    { id: 'table', icon: TableIcon, label: 'Table' },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col overflow-hidden mb-6 group transition-all hover:shadow-lg hover:border-indigo-200">
      {/* Card Header */}
      <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
           <div className="flex space-x-1">
             <div className="w-2.5 h-2.5 rounded-full bg-red-400/70"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70"></div>
           </div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Result Output</span>
        </div>
        
        {/* Chart Switcher Toolbar */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
          {chartOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveChartType(opt.id)}
              className={`p-1 rounded-md transition-all flex items-center gap-1.5 px-2 ${
                activeChartType === opt.id 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title={opt.label}
            >
              <opt.icon size={12} />
              <span className="text-[10px] font-bold uppercase">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-4 bg-slate-50/30 flex-1">
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm h-[400px]">
            <ChartRenderer data={message.chartData} config={config} />
         </div>
      </div>
      
      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-slate-50 bg-white flex justify-between items-center text-[10px] text-slate-400 font-medium">
         <span>Intent: {message.chartConfig?.intent || 'Analysis'}</span>
         <span>Extracted from AI response</span>
      </div>
    </div>
  );
});

DashboardCard.displayName = 'DashboardCard';

const QueryPage = () => {
  const [messages, setMessages] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    // 1. Fetch Datasets
    api.get('/upload/datasets').then(({ data }) => {
      if (!isMounted) return;
      setDatasets(data);
      if (data.length > 0) setSelectedDataset(data[0]._id);
    });

    // 2. Fetch Query History
    api.get('/query/history').then(({ data }) => {
      if (!isMounted) return;
      const historyMessages = data.reverse().flatMap(q => ([
        { role: 'user', content: q.prompt },
        { 
          role: 'bot', 
          content: `I've generated a ${q.chartConfig?.chartType || 'table'} chart reflecting your query.`, 
          chartData: q.resultData,
          chartConfig: q.chartConfig
        }
      ]));
      setMessages(historyMessages);
    }).catch(err => {
      console.error('Failed to fetch history', err);
    });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    // Auto-scroll the canvas safely
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        canvasEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const handleSendMessage = async (prompt) => {
    if (!selectedDataset) {
       setMessages(prev => [...prev, { role: 'user', content: prompt }, { role: 'bot', content: 'Please select a dataset first from the dropdown.' }]);
       return;
    }
    
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setLoading(true);

    try {
      const { data } = await api.post('/query', {
        datasetId: selectedDataset,
        prompt
      });
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `I've generated a ${data.chartConfig.chartType} chart reflecting your query.`, 
        chartData: data.data,
        chartConfig: data.chartConfig
      }]);
    } catch (error) {
      toast.error('Failed to generate query');
      setMessages(prev => [...prev, { role: 'bot', content: `Sorry, ConvBI failed to generate the query. ${error.response?.data?.message || 'Please try again.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const chartMessages = useMemo(() => {
    return messages.filter(m => m.chartData && m.chartConfig);
  }, [messages]);

  const activeDatasetName = datasets.find(d => d._id === selectedDataset)?.name || 'Unknown Source';

  return (
    <div className="h-[calc(100vh-72px)] w-full flex bg-slate-100 overflow-hidden">
      
      {/* LEFT PANE */}
      <div className="w-full md:w-[32%] min-w-[320px] max-w-[420px] flex flex-col bg-white border-r border-slate-200 shadow-[2px_0_12px_-4px_rgba(0,0,0,0.08)] z-10 relative">
        <div className="flex-none p-4 border-b border-slate-100 bg-white">
           <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
               <Database size={16} />
             </div>
             AI Data Agent
           </h1>
           
           <div className="w-full relative">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute -top-2 left-2 bg-white px-1">Active Source</label>
              <select 
                value={selectedDataset} 
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block px-3 py-2.5 outline-none cursor-pointer transition-all"
              >
                {datasets.length === 0 && <option value="">No datasets available</option>}
                {datasets.map(ds => (
                  <option key={ds._id} value={ds._id}>{ds.name} ({ds.columns.length} columns)</option>
                ))}
              </select>
           </div>
        </div>
        
        <div className="flex-1 overflow-hidden bg-slate-50/30">
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} loading={loading} />
        </div>
      </div>

      {/* RIGHT PANE: Dashboard Results Gallery */}
      <div className="hidden md:flex flex-1 flex-col bg-slate-50 relative overflow-hidden">
        {/* Gallery Header */}
        <div className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
          <div className="flex items-center space-x-3 text-slate-600">
            <Layout size={18} className="text-indigo-500" />
            <span className="text-sm font-bold tracking-tight text-slate-800 uppercase">Dashboard Canvas</span>
            {chartMessages.length > 0 && (
               <div className="flex items-center space-x-2">
                 <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                 <span className="text-xs font-medium text-slate-400">
                   {chartMessages.length} Result{chartMessages.length !== 1 ? 's' : ''}
                 </span>
               </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Active: <span className="text-slate-700 font-bold">{activeDatasetName}</span></span>
             </div>
          </div>
        </div>

        {/* Gallery Body */}
        <div className="flex-1 p-6 overflow-y-auto scroll-smooth custom-scrollbar">
          {chartMessages.length > 0 ? (
             <div className="max-w-5xl mx-auto space-y-2">
               {chartMessages.map((msg, idx) => (
                 <DashboardCard key={`card-${idx}`} message={msg} />
               ))}
               <div ref={canvasEndRef} className="h-4" />
             </div>
          ) : (
            <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-white/40 backdrop-blur-sm mx-auto max-w-4xl my-10 transition-all hover:bg-white/60">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 ring-8 ring-indigo-50/50">
                 <Terminal size={40} className="text-indigo-500" strokeWidth={1.5} />
               </div>
               <p className="text-xl font-bold text-slate-800 tracking-tight">Your Canvas is Ready</p>
               <p className="text-sm mt-3 max-w-sm text-center text-slate-500 leading-relaxed font-medium">Use the chat interface on the left to ask questions. Every generated chart will appear here as a persistent trackable result.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default QueryPage;

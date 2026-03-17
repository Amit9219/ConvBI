import { useState, useEffect, useMemo } from 'react';
import ChatWindow from '../components/Chat/ChatWindow';
import ChartRenderer from '../components/Dashboard/ChartRenderer';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Database, Terminal, BarChart2 } from 'lucide-react';

const QueryPage = () => {
  const [messages, setMessages] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch Datasets
    api.get('/upload/datasets').then(({ data }) => {
      setDatasets(data);
      if (data.length > 0) setSelectedDataset(data[0]._id);
    });

    // 2. Fetch Query History
    api.get('/query/history').then(({ data }) => {
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
  }, []);

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

  // Find the most recent chart generation to display in the right pane
  const latestChartMessage = useMemo(() => {
    return [...messages].reverse().find(m => m.chartData && m.chartConfig);
  }, [messages]);

  const activeDatasetName = datasets.find(d => d._id === selectedDataset)?.name || 'Unknown Source';

  return (
    <div className="h-[calc(100vh-72px)] w-full flex bg-slate-100 overflow-hidden">
      
      {/* LEFT PANE: Chat Interface (35% width, min 320px) */}
      <div className="w-full md:w-[35%] min-w-[320px] max-w-[450px] flex flex-col bg-white border-r border-slate-200 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] z-10 relative">
        
        {/* Chat Header / Dataset Selection */}
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
        
        {/* Chat Window Container */}
        <div className="flex-1 overflow-hidden bg-slate-50/50">
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} loading={loading} />
        </div>
      </div>

      {/* RIGHT PANE: Dashboard/Terminal View (65% width) */}
      <div className="hidden md:flex flex-1 flex-col bg-slate-50 relative overflow-hidden">
        {/* Right Pane Header */}
        <div className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-0">
          <div className="flex items-center space-x-2 text-slate-600">
            <BarChart2 size={16} />
            <span className="text-sm font-semibold">Dashboard Canvas</span>
            {latestChartMessage && (
               <span className="ml-2 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100 uppercase tracking-wide">
                 {latestChartMessage.chartConfig.chartType} View
               </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
             <span>Source: <span className="text-slate-600">{activeDatasetName}</span></span>
          </div>
        </div>

        {/* Right Pane Body (The Canvas) */}
        <div className="flex-1 p-6 overflow-y-auto">
          {latestChartMessage ? (
             <div className="w-full h-full min-h-[500px] bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden relative group">
                {/* Decorative Header for the Terminal Box */}
                <div className="h-8 bg-slate-100/50 border-b border-slate-200 flex items-center px-4 space-x-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                   <div className="flex-1 text-center pr-8">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Render Output</span>
                   </div>
                </div>
                
                {/* The Actual Chart */}
                <div className="flex-1 p-6 relative">
                  <ChartRenderer data={latestChartMessage.chartData} config={latestChartMessage.chartConfig} />
                </div>
             </div>
          ) : (
            /* Empty State */
            <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-white/50">
               <Terminal size={48} className="mb-4 text-slate-300" strokeWidth={1.5} />
               <p className="text-lg font-medium text-slate-600">No output generated yet</p>
               <p className="text-sm mt-2 max-w-sm text-center">Use the chat interface on the left to ask questions about your data, and the resulting charts will appear right here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default QueryPage;

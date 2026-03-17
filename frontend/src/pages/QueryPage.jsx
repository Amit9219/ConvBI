import { useState, useEffect } from 'react';
import ChatWindow from '../components/Chat/ChatWindow';
import api from '../lib/axios';
import toast from 'react-hot-toast';

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
      setMessages(prev => [...prev, { role: 'bot', content: `Sorry, I couldn't generate the query. ${error.response?.data?.message || error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-slate-800">New AI Query</h1>
            <p className="text-slate-500 text-sm mt-1">Chat to generate dynamic charts and insights instantly</p>
         </div>
         <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-3">
            <span className="text-sm font-semibold text-slate-600">Active Source:</span>
            <select 
              value={selectedDataset} 
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-1.5 outline-none cursor-pointer"
            >
              {datasets.length === 0 && <option value="">No datasets available</option>}
              {datasets.map(ds => (
                <option key={ds._id} value={ds._id}>{ds.name} ({ds.columns.length} cols)</option>
              ))}
            </select>
         </div>
      </div>
      
      <ChatWindow messages={messages} onSendMessage={handleSendMessage} loading={loading} />
    </div>
  );
};
export default QueryPage;

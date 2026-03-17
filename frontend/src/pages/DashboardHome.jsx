import { useState, useEffect } from 'react';
import api from '../lib/axios';
import ChartCard from '../components/Dashboard/ChartCard';
import { LayoutDashboard, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Footer from '../components/Landing/Footer';

const DashboardHome = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/query/history');
        setQueries(data);
      } catch (e) {
        console.error('Failed to fetch queries', e);
        toast.error('Failed to fetch dashboard history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Your Dashboards</h1>
            <p className="text-slate-500 text-sm mt-1">Overview of your recent AI-generated visualizations</p>
          </div>
          <Link to="/query" className="flex items-center px-4 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-[0_4px_12px_-2px_rgba(79,70,229,0.3)]">
            <Plus size={18} className="mr-2" /> New Query
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
        ) : queries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center flex flex-col items-center shadow-sm">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mb-6">
                 <LayoutDashboard size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No charts generated yet</h3>
              <p className="text-slate-500 text-[15px] mt-2 max-w-md">Head over to the AI Query page to generate your first dynamic visualizations from your uploaded datasets.</p>
              <Link to="/query" className="mt-8 px-6 py-3 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-xl hover:bg-indigo-100 transition-colors">Start Exploring Data</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {queries.map(q => (
              <ChartCard 
                key={q._id}
                title={q.prompt}
                data={q.resultData}
                config={q.chartConfig}
              />
            ))}
          </div>
        )}
      </div>

      <Features />
      <Footer />
    </div>
  );
};
export default DashboardHome;

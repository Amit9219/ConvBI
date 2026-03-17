import { useState, useEffect } from 'react';
import api from '../lib/axios';
import FileUpload from '../components/Upload/FileUpload';
import { Database, Table, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const DatasetsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDatasets = async () => {
    try {
      const { data } = await api.get('/upload/datasets');
      setDatasets(data);
    } catch (err) {
      toast.error('Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleUploadSuccess = (newDataset) => {
    setDatasets([newDataset, ...datasets]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Data Sources</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Manage your uploaded datasets for querying</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-black rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
             <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
               <h3 className="font-semibold text-gray-800 dark:text-white">Your Datasets ({datasets.length})</h3>
             </div>
             
             {loading ? (
                <div className="p-8 text-center text-slate-500">Loading...</div>
             ) : datasets.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-400 mb-4">
                     <Database size={24} />
                  </div>
                  <h4 className="text-gray-800 dark:text-white font-medium">No datasets found</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Upload a CSV file to get started.</p>
                </div>
             ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
                  {datasets.map((ds) => (
                    <li key={ds._id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                      <div className="flex items-start justify-between">
                         <div className="flex items-start space-x-4">
                           <div className="p-2 bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-lg mt-1">
                             <Table size={20} />
                           </div>
                           <div>
                             <h4 className="text-sm font-semibold text-slate-800 dark:text-gray-200">{ds.name}</h4>
                             <div className="flex items-center space-x-4 mt-2">
                               <div className="flex items-center text-xs text-slate-500 dark:text-gray-400 font-medium">
                                 <Database size={12} className="mr-1" />
                                 {ds.columns.length} columns
                               </div>
                               <div className="flex items-center text-xs text-slate-500 dark:text-gray-400 font-medium">
                                 <Calendar size={12} className="mr-1" />
                                 {new Date(ds.createdAt).toLocaleDateString()}
                               </div>
                             </div>
                             <div className="flex flex-wrap gap-2 mt-3">
                               {ds.columns.slice(0, 5).map(col => (
                                 <span key={col.name} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                                   {col.name} <span className="text-gray-400 dark:text-gray-500 ml-1">({col.type})</span>
                                 </span>
                               ))}
                               {ds.columns.length > 5 && <span className="text-xs text-gray-400">+{ds.columns.length - 5} more</span>}
                             </div>
                           </div>
                         </div>
                      </div>
                    </li>
                  ))}
                </ul>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetsPage;

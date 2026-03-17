import { useState, useCallback } from 'react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       const droppedFile = e.dataTransfer.files[0];
       if(droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
         setFile(droppedFile);
       } else {
         toast.error('Please upload a valid CSV file');
       }
    }
  }, []);

  const handleUpload = async () => {
     if(!file) return;
     setLoading(true);
     
     const formData = new FormData();
     formData.append('file', file);
     formData.append('name', file.name.replace('.csv', ''));

     try {
       const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
       });
       toast.success('Dataset uploaded successfully!');
       onUploadSuccess(data);
       setFile(null);
     } catch (err) {
       toast.error(err.response?.data?.message || 'Dataset upload failed');
     } finally {
       setLoading(false);
     }
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors">Upload New Dataset</h3>
      
      {!file ? (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            isDragActive 
              ? 'border-indigo-600 bg-gray-50 dark:bg-black/40' 
              : 'border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
          }`}
          onClick={() => document.getElementById('csv-upload').click()}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium transition-colors">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-colors">CSV files only (max 10MB)</p>
          <input 
            type="file" 
            id="csv-upload" 
            className="hidden" 
            accept=".csv"
            onChange={(e) => {
               if(e.target.files && e.target.files[0]) setFile(e.target.files[0]);
            }}
          />
        </div>
      ) : (
        <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors">
                <File size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[200px] transition-colors">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 rounded-lg transition-colors"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 transition-all active:scale-[0.98]"
          >
            {loading ? <><Loader2 className="animate-spin mr-2" size={16} /> Uploading...</> : 'Upload to Database'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

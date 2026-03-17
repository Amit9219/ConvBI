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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload New Dataset</h3>
      
      {!file ? (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
          }`}
          onClick={() => document.getElementById('csv-upload').click()}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-slate-500 mt-1">CSV files only (max 10MB)</p>
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
        <div className="border rounded-xl p-4 bg-slate-50 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <File size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 transition-colors"
          >
            {loading ? <><Loader2 className="animate-spin mr-2" size={16} /> Uploading...</> : 'Upload to Database'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

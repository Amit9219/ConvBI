import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-black dark:to-gray-950 p-4 transition-colors duration-500">
      <div className="max-w-md w-full p-8 bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-800 transition-all duration-300">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-inter text-slate-800 dark:text-white transition-colors">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">Sign in to your Conversational BI account</p>
         </div>
         <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 transition-colors">Email Address</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="block w-full rounded-2xl border-slate-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3.5 border transition-all" placeholder="you@company.com" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 transition-colors">Password</label>
               <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="block w-full rounded-2xl border-slate-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3.5 border transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 rounded-2xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all font-bold disabled:opacity-70 mt-4 active:scale-[0.98]">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
         </form>
         <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 transition-colors">
           Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold transition-colors">Create one now</Link>
         </p>
      </div>
    </div>
  );
};
export default Login;

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-4">
      <div className="max-w-md w-full p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-inter text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to your Conversational BI account</p>
         </div>
         <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="block w-full rounded-xl border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 border transition-shadow" placeholder="you@company.com" />
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
               <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="block w-full rounded-xl border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 border transition-shadow" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all font-medium disabled:opacity-70 mt-4">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
         </form>
         <p className="mt-6 text-center text-sm text-slate-600">
           Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">Create one now</Link>
         </p>
      </div>
    </div>
  );
};
export default Login;

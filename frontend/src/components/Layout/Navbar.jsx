import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, User, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50 w-full transition-all duration-300">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <span className="font-bold text-xl">C</span>
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">ConvBI</span>
      </div>

      {/* Center: Search Bar (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-12">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search documents, datasets..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        {/* User Profile */}
        <motion.div 
          whileHover={{ x: -2 }}
          className="flex items-center space-x-3 text-slate-700 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl cursor-default"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <User size={16} />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold leading-none">{user?.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Administrator</p>
          </div>
        </motion.div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

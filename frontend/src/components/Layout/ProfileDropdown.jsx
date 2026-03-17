import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

const ProfileDropdown = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Display initialization letter
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 px-3 py-1.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm font-bold text-sm">
          {initial}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-xs font-bold leading-none truncate max-w-[100px] transition-colors">{user?.name || 'User'}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[100px] transition-colors">{user?.email || 'User'}</p>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 hidden lg:block ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-slate-100 dark:border-gray-800 py-2 z-50 overflow-hidden transition-colors"
          >
            <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800 lg:hidden">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
            
            <div className="py-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2 flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="My Profile"
              >
                <User size={16} />
                <span>My Profile</span>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2 flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Settings"
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
            
            <div className="border-t border-slate-100 dark:border-gray-800 pt-1 mt-1">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 flex items-center space-x-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;

import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        console.log('Theme toggle clicked');
        toggleTheme();
      }}
      className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-gray-700"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="fill-slate-600/10" />
      ) : (
        <Sun size={20} className="fill-indigo-400/10" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;

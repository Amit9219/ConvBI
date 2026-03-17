import { motion, AnimatePresence } from 'framer-motion';
import { useLoaderStore } from '../store/useLoaderStore';

const Loader = () => {
  const { isLoading, message } = useLoaderStore();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md pointer-events-auto"
        >
          <div className="relative flex flex-col items-center">
            {/* Main Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            />
            
            {/* Inner Pulsing Core */}
            <motion.div
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/50"
            />
            
            {/* Brand Logo/Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col items-center"
            >
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                ConvBI
              </span>
              <p className="mt-2 text-sm font-medium text-slate-500 animate-pulse">
                {message}
              </p>
            </motion.div>
          </div>
          
          {/* Decorative background blobs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200/20 rounded-full blur-[100px] -z-10 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-200/20 rounded-full blur-[100px] -z-10 animate-blob" style={{ animationDelay: '2s' }}></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;

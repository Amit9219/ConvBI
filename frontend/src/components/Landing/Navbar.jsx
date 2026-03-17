import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all"
          >
            <span className="font-bold text-xl">C</span>
          </motion.div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ConvBI</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Features</Link>
          <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
          <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">About</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Sign In</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/register" 
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-[0_10px_20px_rgba(79,110,247,0.2)] flex items-center gap-2"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-6 md:hidden shadow-xl"
        >
          <div className="flex flex-col space-y-4">
            <Link to="/features" className="text-base font-semibold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
            <Link to="/pricing" className="text-base font-semibold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            <Link to="/about" className="text-base font-semibold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <hr className="border-slate-100" />
            <Link to="/login" className="text-base font-semibold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            <Link 
              to="/register" 
              className="px-6 py-4 bg-indigo-600 text-white text-center font-bold rounded-2xl shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default LandingNavbar;

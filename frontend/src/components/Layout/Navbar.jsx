import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Menu, X, ArrowRight, LayoutDashboard, MessageSquarePlus, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import ProfileDropdown from './ProfileDropdown';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinksAfterLogin = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'New AI Query', href: '/query', icon: MessageSquarePlus },
    { name: 'Datasets', href: '/datasets', icon: Database },
  ];

  const navLinksBeforeLogin = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || user
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          
          {/* Logo (Left side) */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all"
            >
              <span className="font-bold text-xl">C</span>
            </motion.div>
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">ConvBI</span>
          </Link>

          {/* Desktop Navigation Links */}
          {user ? (
            /* AFTER LOGIN: Centered Links & Search */
            <div className="hidden lg:flex items-center flex-1 justify-center space-x-2 mx-8">
              {/* Search Bar for authenticated users */}
              <div className="flex-1 max-w-sm mr-4 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Ask or search..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex space-x-1 border border-slate-200 bg-slate-50/50 rounded-xl p-1">
                {navLinksAfterLogin.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive 
                          ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                      )}
                    >
                      <item.icon className={cn("mr-2 h-4 w-4", isActive ? "text-indigo-600" : "text-slate-500")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            /* BEFORE LOGIN: Centered Links */
            <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
              {navLinksBeforeLogin.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4 shrink-0">
            {user ? (
              /* AFTER LOGIN: Notifications & Profile */
              <>
                <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <ProfileDropdown user={user} handleLogout={handleLogout} />
              </>
            ) : (
              /* BEFORE LOGIN: Login / Signup */
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-4">
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-[0_5px_15px_rgba(79,110,247,0.2)] flex items-center gap-2"
                  >
                    Get Started <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {user && (
              <ProfileDropdown user={user} handleLogout={handleLogout} />
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-lg absolute top-full left-0 w-full"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {user ? (
                <>
                  <div className="mb-2">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Ask or search..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  {navLinksAfterLogin.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'flex items-center px-4 py-3 rounded-xl text-base font-semibold',
                          isActive 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-indigo-600" : "text-slate-500")} />
                        {item.name}
                      </Link>
                    )
                  })}
                </>
              ) : (
                <>
                  {navLinksBeforeLogin.map(item => (
                    <Link key={item.name} to={item.href} className="text-base font-semibold text-slate-600 py-2">
                      {item.name}
                    </Link>
                  ))}
                  <div className="h-px bg-slate-100 my-2"></div>
                  <Link to="/login" className="text-base font-semibold text-slate-600 py-2">Sign In</Link>
                  <Link 
                    to="/register" 
                    className="mt-4 px-6 py-3 bg-indigo-600 text-white text-center font-bold rounded-xl shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

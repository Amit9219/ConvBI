import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquarePlus, Database } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'New AI Query', href: '/query', icon: MessageSquarePlus },
    { name: 'Datasets', href: '/datasets', icon: Database },
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col bg-slate-900 shadow-xl border-r border-slate-800 z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
          ConvBI
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-3 py-2.5 rounded-xl font-medium transition-all duration-200',
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-indigo-200' : 'text-slate-500 group-hover:text-indigo-400'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4 shadow-inner">
           <h4 className="text-white text-sm font-semibold mb-1">AI Assistant Ready</h4>
           <p className="text-slate-400 text-xs text-balance">Ask plain english questions to drill into your data seamlessly.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden font-inter">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full border-l border-slate-200/60 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;

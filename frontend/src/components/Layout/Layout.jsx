import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen w-full bg-white dark:bg-black flex flex-col overflow-hidden font-inter pt-[72px] transition-colors duration-300">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 dark:bg-black/50">
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;

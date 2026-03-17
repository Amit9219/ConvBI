import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-inter pt-[72px]">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;

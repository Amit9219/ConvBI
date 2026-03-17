import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout/Layout';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';

import DashboardHome from './pages/DashboardHome';
import QueryPage from './pages/QueryPage';
import DatasetsPage from './pages/DatasetsPage';
import LandingPage from './pages/LandingPage';
import { useAuthStore } from './store/useAuthStore';
import Navbar from './components/Layout/Navbar';
import Loader from './components/Loader';
import { useLoaderStore } from './store/useLoaderStore';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { user } = useAuthStore();
  const { startLoading, stopLoading } = useLoaderStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Sync theme with document class
    if (theme === 'dark') {
      console.log('Switching to Dark Mode');
      document.documentElement.classList.add('dark');
    } else {
      console.log('Switching to Light Mode');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Initial Page Loader Logic
    startLoading("Initializing Experience...");
    
    const handleLoad = () => {
      setTimeout(stopLoading, 800); // Small delay for smooth exit
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Fallback Timeout: Force stop loading after 5 seconds
    const fallback = setTimeout(() => {
      stopLoading();
    }, 5000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#0a0a0a' : '#ffffff',
            color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
            border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #e2e8f0',
          },
        }}
      />
      <Loader />
      <Navbar />
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={user ? <ProtectedRoute><Layout /></ProtectedRoute> : <LandingPage />}>
          <Route index element={<DashboardHome />} />
          <Route path="query" element={<QueryPage />} />
          <Route path="datasets" element={<DatasetsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

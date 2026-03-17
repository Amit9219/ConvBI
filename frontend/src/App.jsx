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

function App() {
  const { user } = useAuthStore();
  const { startLoading, stopLoading } = useLoaderStore();

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
      <Toaster position="top-right" />
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

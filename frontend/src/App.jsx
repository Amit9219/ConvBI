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

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Toaster position="top-right" />
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

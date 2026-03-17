import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout/Layout';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';

import DashboardHome from './pages/DashboardHome';
import QueryPage from './pages/QueryPage';
import DatasetsPage from './pages/DatasetsPage';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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

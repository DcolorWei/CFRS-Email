import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import StrategyPage from './pages/strategy/StrategyPage';
import EmailPage from './pages/email/EmailPage';
import AuthPage from './pages/auth/AuthPage';

const PrivateRoute = ({ redirectPath = '/auth' }) => {
  // 检查 localStorage 中的 token
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/email" element={<EmailPage />} />
          <Route path="/strategy" element={<StrategyPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/email" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

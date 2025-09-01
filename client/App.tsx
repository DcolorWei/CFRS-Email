import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import StrategyPage from './pages/strategy/StrategyPage';
import EmailPage from './pages/email/EmailPage';
import { useEffect } from 'react';
import { wsService } from './lib/websocket';

const Main = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/email")
  }, []);
  return (
    <div>
    </div>
  );
}


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Main />} />
        <Route path="/email" element={<EmailPage />} />
        <Route path="/strategy" element={<StrategyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

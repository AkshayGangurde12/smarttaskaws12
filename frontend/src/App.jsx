import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/planner" element={<PlannerPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

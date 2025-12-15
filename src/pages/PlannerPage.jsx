import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GoalForm from '../components/GoalForm';
import PlanView from '../components/PlanView';
import PlanHistory from '../components/PlanHistory';
import './PlannerPage.css';

function PlannerPage() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get authenticated user

  // Create user-specific localStorage key
  const getHistoryKey = () => {
    if (!user) return 'planHistory';
    return `planHistory_${user._id || user.id}`;
  };

  // Save plan to user-specific history when created
  useEffect(() => {
    if (plan && user) {
      const historyKey = getHistoryKey();
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const newHistory = [plan, ...history].slice(0, 10); // Keep last 10 plans
      localStorage.setItem(historyKey, JSON.stringify(newHistory));
    }
  }, [plan, user]);

  const handleCreatePlan = async (goalText) => {
    try {
      setLoading(true);
      setError('');
      setPlan(null);

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to create plans');
      }

      const res = await fetch('http://localhost:5000/api/plan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ goalText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create plan');
      }

      const data = await res.json();
      setPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (selectedPlan) => {
    setPlan(selectedPlan);
    setError('');
  };

  const handleReset = () => {
    setPlan(null);
    setError('');
  };

  return (
    <div className="planner-page">
      <Header />
      
      <main className="planner-container">
        {/* Enhanced Hero with User Greeting */}
        <div className="planner-hero">
          <div className="hero-decoration">
            <div className="floating-circle circle-1"></div>
            <div className="floating-circle circle-2"></div>
            <div className="floating-circle circle-3"></div>
          </div>
          
          <div className="hero-content">
            {user && (
              <div className="user-greeting">
                <div className="greeting-avatar">
                  <span className="avatar-icon">👤</span>
                </div>
                <div className="greeting-text">
                  <p className="greeting-welcome">Welcome back,</p>
                  <h2 className="greeting-name">{user.name || user.email}</h2>
                </div>
              </div>
            )}
            
            <h1>🎯 Smart Task Planner</h1>
            <p className="planner-subtitle">
              Transform your goals into actionable tasks with AI-powered planning
            </p>
            
            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="stat-icon">✨</div>
                <div className="stat-info">
                  <div className="stat-number">AI-Powered</div>
                  <div className="stat-label">Planning</div>
                </div>
              </div>
              <div className="hero-stat-item">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-number">Smart</div>
                  <div className="stat-label">Breakdown</div>
                </div>
              </div>
              <div className="hero-stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <div className="stat-number">Goal</div>
                  <div className="stat-label">Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GoalForm 
          onCreatePlan={handleCreatePlan} 
          loading={loading}
          disabled={loading}
        />

        <PlanHistory onSelectPlan={handleSelectPlan} />

        {loading && (
          <div className="status-message info">
            <div className="spinner"></div>
            <span>Generating your personalized plan...</span>
          </div>
        )}

        {error && (
          <div className="status-message error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {plan && (
          <PlanView 
            goal={plan.goal} 
            tasks={plan.tasks} 
            onReset={handleReset}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default PlannerPage;

import { useState, useEffect } from 'react';
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

  // Save plan to history when created
  useEffect(() => {
    if (plan) {
      const history = JSON.parse(localStorage.getItem('planHistory') || '[]');
      const newHistory = [plan, ...history].slice(0, 10); // Keep last 10 plans
      localStorage.setItem('planHistory', JSON.stringify(newHistory));
    }
  }, [plan]);

  const handleCreatePlan = async (goalText) => {
    try {
      setLoading(true);
      setError('');
      setPlan(null);

      const res = await fetch('http://localhost:5000/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        <div className="planner-hero">
          <h1>🎯 Smart Task Planner</h1>
          <p className="planner-subtitle">
            Transform your goals into actionable tasks with AI-powered planning
          </p>
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

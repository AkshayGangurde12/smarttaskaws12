import { useState, useEffect } from 'react';

function PlanHistory({ onSelectPlan }) {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('planHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectPlan = (plan) => {
    onSelectPlan(plan);
    setIsOpen(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('planHistory');
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="plan-history-container">
      <button 
        className="history-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📚</span>
        <span>Plan History ({history.length})</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="history-dropdown">
          <div className="history-header">
            <h3>Recent Plans</h3>
            <button 
              className="clear-history-btn"
              onClick={handleClearHistory}
            >
              Clear All
            </button>
          </div>
          
          <div className="history-list">
            {history.map((item, index) => (
              <div 
                key={index}
                className="history-item"
                onClick={() => handleSelectPlan(item)}
              >
                <div className="history-item-content">
                  <p className="history-goal">{item.goal.text}</p>
                  <div className="history-meta">
                    <span className="history-date">
                      🕒 {formatDate(item.goal.createdAt)}
                    </span>
                    <span className="history-tasks">
                      📝 {item.tasks.length} tasks
                    </span>
                  </div>
                </div>
                <span className="history-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanHistory;

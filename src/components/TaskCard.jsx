import { useState } from 'react';

function TaskCard({ task, onToggleComplete }) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleToggle = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    if (onToggleComplete) {
      onToggleComplete(task._id, newState);
    }
  };

  return (
    <li className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-number">{task.order}</div>
        <h4 className="task-title">{task.title}</h4>
        <button 
          className="task-checkbox"
          onClick={handleToggle}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted ? '✓' : ''}
        </button>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        {task.dependsOn !== null && task.dependsOn !== undefined ? (
          <div className="meta-item">
            <span className="meta-icon">🔗</span>
            <span className="meta-label">Depends on:</span>
            <span className="dependency-badge">
              Task {task.dependsOn}
            </span>
          </div>
        ) : (
          <div className="meta-item">
            <span className="meta-icon">🚀</span>
            <span className="meta-label">Can start:</span>
            <span className="meta-value">Immediately</span>
          </div>
        )}
        
        {task.estimatedDays && (
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span className="meta-label">Duration:</span>
            <span className="days-badge">
              {task.estimatedDays} {task.estimatedDays === 1 ? 'day' : 'days'}
            </span>
          </div>
        )}
      </div>
    </li>
  );
}

export default TaskCard;

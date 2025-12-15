function TaskCard({ task, isCompleted = false, onToggleComplete }) {
  const handleToggle = () => {
    const newState = !isCompleted;
    if (onToggleComplete) {
      onToggleComplete(task._id, newState);
    }
  };

  // Determine priority based on dependencies and duration
  const getPriorityBadge = () => {
    if (task.dependsOn === null || task.dependsOn === undefined) {
      return { text: 'High Priority', color: '#ef4444', icon: '🔥' };
    } else if (task.estimatedDays && task.estimatedDays <= 2) {
      return { text: 'Quick Win', color: '#10b981', icon: '⚡' };
    }
    return null;
  };

  const priority = getPriorityBadge();

  return (
    <li className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-card-glow"></div>
      
      <div className="task-header">
        <div className="task-number-wrapper">
          <div className="task-number">{task.order}</div>
          {priority && (
            <span 
              className="priority-badge" 
              style={{ 
                '--badge-color': priority.color,
                backgroundColor: `${priority.color}15`,
                color: priority.color,
                borderColor: `${priority.color}40`
              }}
            >
              <span className="priority-icon">{priority.icon}</span>
              {priority.text}
            </span>
          )}
        </div>
        
        <div className="task-title-wrapper">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-status-row">
            <span className={`task-status-badge ${isCompleted ? 'status-completed' : 'status-pending'}`}>
              <span className="status-icon">{isCompleted ? '✓' : '⏳'}</span>
              <span className="status-text">{isCompleted ? 'Completed' : 'Pending'}</span>
            </span>
          </div>
        </div>
        
        <button 
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={handleToggle}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <span className="checkbox-icon">{isCompleted ? '✓' : ''}</span>
          <span className="checkbox-ripple"></span>
        </button>
      </div>
      
      {task.description && (
        <div className="task-description-wrapper">
          <div className="description-icon">📝</div>
          <p className="task-description">{task.description}</p>
        </div>
      )}
      
      <div className="task-meta">
        <div className="meta-group">
          {task.dependsOn !== null && task.dependsOn !== undefined ? (
            <div className="meta-item dependency-item">
              <span className="meta-icon">🔗</span>
              <div className="meta-content">
                <span className="meta-label">Depends on</span>
                <span className="dependency-badge">
                  <span className="dependency-icon">🔗</span>
                  Task {task.dependsOn}
                </span>
              </div>
            </div>
          ) : (
            <div className="meta-item start-item">
              <span className="meta-icon">🚀</span>
              <div className="meta-content">
                <span className="meta-label">Can start</span>
                <span className="meta-value ready">Immediately</span>
              </div>
            </div>
          )}
        </div>
        
        {task.estimatedDays && (
          <div className="meta-item duration-item">
            <span className="meta-icon">⏱️</span>
            <div className="meta-content">
              <span className="meta-label">Duration</span>
              <span className="days-badge">
                <span className="days-number">{task.estimatedDays}</span>
                <span className="days-text">{task.estimatedDays === 1 ? 'day' : 'days'}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

export default TaskCard;

import { useState } from 'react';
import TaskCard from './TaskCard';
import ExportMenu from './ExportMenu';
import StatsDashboard from './StatsDashboard';
import SearchFilter from './SearchFilter';
import TimelineView from './TimelineView';
import ViewToggle from './ViewToggle';
import Button from './ui/Button';

function PlanView({ goal, tasks, onReset }) {
  const [completedTasks, setCompletedTasks] = useState({});
  const [currentView, setCurrentView] = useState('list');
  const [filters, setFilters] = useState({ search: '', filter: 'all', sort: 'order' });
  
  const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Apply filters and search
  const filteredTasks = sortedTasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Status filter (completed/pending)
    if (filters.filter === 'completed') {
      return completedTasks[task._id] === true;
    } else if (filters.filter === 'pending') {
      return !completedTasks[task._id];
    }

    // Type filter
    if (filters.filter === 'independent') {
      return task.dependsOn === null || task.dependsOn === undefined;
    } else if (filters.filter === 'dependent') {
      return task.dependsOn !== null && task.dependsOn !== undefined;
    } else if (filters.filter === 'quick') {
      return task.estimatedDays && task.estimatedDays <= 2;
    }

    return true;
  });

  // Apply sorting
  const displayTasks = [...filteredTasks].sort((a, b) => {
    switch (filters.sort) {
      case 'duration-asc':
        return (a.estimatedDays || 0) - (b.estimatedDays || 0);
      case 'duration-desc':
        return (b.estimatedDays || 0) - (a.estimatedDays || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return (a.order || 0) - (b.order || 0);
    }
  });

  const totalDays = sortedTasks.reduce((sum, task) => sum + (task.estimatedDays || 0), 0);
  const tasksWithDeps = sortedTasks.filter(task => task.dependsOn !== null).length;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercentage = sortedTasks.length > 0 
    ? Math.round((completedCount / sortedTasks.length) * 100) 
    : 0;

  const handleToggleComplete = (taskId, isCompleted) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: isCompleted
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="plan-view">
      {/* Enhanced Plan Header */}
      <div className="plan-header">
        <div className="plan-header-decoration">
          <div className="decoration-orb orb-1"></div>
          <div className="decoration-orb orb-2"></div>
        </div>
        
        <div className="plan-header-top">
          <div className="plan-title-section">
            <div className="plan-icon-wrapper">
              <span className="plan-icon">📋</span>
            </div>
            <h2>Your Action Plan</h2>
          </div>
          <div className="plan-actions">
            <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
            <ExportMenu plan={{ goal, tasks }} />
          </div>
        </div>
        
        <div className="goal-display">
          <div className="goal-label">
            <span className="goal-label-icon">🎯</span>
            <span>Goal</span>
          </div>
          <p className="goal-text">{goal.text}</p>
        </div>
        
        {/* Progress Bar */}
        {completedCount > 0 && (
          <div className="progress-section">
            <div className="progress-label">
              <span>Progress</span>
              <span className="progress-percentage">{progressPercentage}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="progress-text">
              {completedCount} of {sortedTasks.length} tasks completed
            </p>
          </div>
        )}
        
        <div className="plan-stats">
          <div className="stat-item">
            <span>📝</span>
            <span>
              <span className="stat-value">{sortedTasks.length}</span> tasks
            </span>
          </div>
          <div className="stat-item">
            <span>⏱️</span>
            <span>
              <span className="stat-value">{totalDays}</span> days estimated
            </span>
          </div>
          <div className="stat-item">
            <span>🔗</span>
            <span>
              <span className="stat-value">{tasksWithDeps}</span> dependencies
            </span>
          </div>
          {completedCount > 0 && (
            <div className="stat-item">
              <span>✅</span>
              <span>
                <span className="stat-value">{completedCount}</span> completed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Dashboard View */}
      {currentView === 'stats' && (
        <StatsDashboard tasks={sortedTasks} completedTasks={completedTasks} />
      )}

      {/* Timeline View */}
      {currentView === 'timeline' && (
        <TimelineView tasks={sortedTasks} />
      )}

      {/* List View */}
      {currentView === 'list' && (
        <div className="tasks-section">
          <div className="tasks-header">
            <h3>Tasks Breakdown</h3>
            <span className="tasks-count">
              {displayTasks.length} {displayTasks.length !== sortedTasks.length && `of ${sortedTasks.length}`} tasks
            </span>
          </div>

          <SearchFilter onFilterChange={handleFilterChange} />

          {displayTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No tasks found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <ul className="task-list">
              {displayTasks.map((task) => (
                <TaskCard 
                  key={task._id} 
                  task={task}
                  isCompleted={completedTasks[task._id] || false}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {onReset && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Button 
            variant="secondary" 
            size="large"
            icon="➕"
            onClick={onReset}
          >
            Create Another Plan
          </Button>
        </div>
      )}
    </div>
  );
}

export default PlanView;

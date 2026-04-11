import { useState, useEffect } from 'react';
import './StatsDashboard.css';

function StatsDashboard({ tasks, completedTasks }) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    totalDays: 0,
    avgDaysPerTask: 0,
    withDependencies: 0,
    independent: 0
  });

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const completed = Object.values(completedTasks).filter(Boolean).length;
    const totalDays = tasks.reduce((sum, task) => sum + (task.estimatedDays || 0), 0);
    const withDeps = tasks.filter(task => task.dependsOn !== null).length;

    setStats({
      total: tasks.length,
      completed: completed,
      inProgress: completed > 0 && completed < tasks.length ? tasks.length - completed : 0,
      notStarted: completed === 0 ? tasks.length : 0,
      totalDays: totalDays,
      avgDaysPerTask: Math.round(totalDays / tasks.length),
      withDependencies: withDeps,
      independent: tasks.length - withDeps
    });
  }, [tasks, completedTasks]);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-dashboard">
      <div className="stats-header">
        <h3>📊 Plan Analytics</h3>
        <button className="stats-toggle" title="Detailed Statistics">
          <span>📈</span>
        </button>
      </div>

      <div className="stats-grid">
        {/* Completion Stats */}
        <div className="stat-card primary">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completed}/{stats.total}</div>
            <div className="stat-label">Tasks Done</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalDays}</div>
            <div className="stat-label">Total Days</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.avgDaysPerTask}</div>
            <div className="stat-label">Avg Days/Task</div>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <div className="stat-value">{stats.withDependencies}</div>
            <div className="stat-label">Dependencies</div>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-value">{stats.independent}</div>
            <div className="stat-label">Can Start Now</div>
          </div>
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="progress-breakdown">
        <div className="breakdown-item">
          <div className="breakdown-bar">
            <div 
              className="breakdown-fill completed"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
            <div 
              className="breakdown-fill in-progress"
              style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
            />
          </div>
          <div className="breakdown-legend">
            <span className="legend-item">
              <span className="legend-dot completed"></span>
              Completed ({stats.completed})
            </span>
            <span className="legend-item">
              <span className="legend-dot pending"></span>
              Remaining ({stats.total - stats.completed})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsDashboard;

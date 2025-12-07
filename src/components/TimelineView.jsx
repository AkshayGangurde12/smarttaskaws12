import { useState, useMemo } from 'react';
import './TimelineView.css';

function TimelineView({ tasks }) {
  const [hoveredTask, setHoveredTask] = useState(null);
  const [viewMode, setViewMode] = useState('gantt'); // 'gantt' or 'vertical'
  const [showWeekends, setShowWeekends] = useState(false);
  
  const sortedTasks = useMemo(() => 
    [...tasks].sort((a, b) => a.order - b.order),
    [tasks]
  );
  
  // Calculate cumulative days for timeline
  const timelineData = useMemo(() => {
    let cumulativeDays = 0;
    return sortedTasks.map(task => {
      const start = cumulativeDays;
      const duration = task.estimatedDays || 1;
      cumulativeDays += duration;
      return {
        ...task,
        startDay: start,
        endDay: cumulativeDays,
        duration,
        startWeek: Math.floor(start / 7) + 1,
        endWeek: Math.ceil(cumulativeDays / 7)
      };
    });
  }, [sortedTasks]);

  const totalDays = useMemo(() => 
    timelineData.length > 0 ? timelineData[timelineData.length - 1].endDay : 0,
    [timelineData]
  );
  
  const totalWeeks = Math.ceil(totalDays / 7);
  const totalMonths = Math.ceil(totalDays / 30);

  // Calculate critical path (tasks with dependencies)
  const criticalPath = useMemo(() => 
    timelineData.filter(task => task.dependsOn !== null),
    [timelineData]
  );

  // Get color based on task duration
  const getTaskColor = (duration) => {
    if (duration <= 2) return 'short';
    if (duration <= 5) return 'medium';
    return 'long';
  };

  // Format date range
  const formatDateRange = (startDay, endDay) => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + startDay);
    const end = new Date(today);
    end.setDate(today.getDate() + endDay - 1);
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  if (viewMode === 'vertical') {
    return (
      <div className="timeline-view timeline-vertical">
        <div className="timeline-header">
          <div className="timeline-header-left">
            <h3>📅 Project Timeline</h3>
            <div className="timeline-stats">
              <span className="stat-badge">
                <span className="stat-icon">📊</span>
                {totalDays} days
              </span>
              <span className="stat-badge">
                <span className="stat-icon">📆</span>
                {totalWeeks} weeks
              </span>
              <span className="stat-badge">
                <span className="stat-icon">🎯</span>
                {tasks.length} tasks
              </span>
            </div>
          </div>
          <button 
            className="view-mode-toggle"
            onClick={() => setViewMode('gantt')}
            title="Switch to Gantt view"
          >
            <span>📊</span>
            Gantt View
          </button>
        </div>

        <div className="timeline-container-vertical">
          <div className="timeline-line"></div>
          <ul className="timeline-items">
            {timelineData.map((task, index) => (
              <li 
                key={task._id} 
                className={`timeline-item ${hoveredTask === task._id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredTask(task._id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div className="timeline-marker">
                  <span className="timeline-marker-number">{task.order}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">{task.title}</div>
                  {task.description && (
                    <p className="timeline-description">{task.description}</p>
                  )}
                  <div className="timeline-meta">
                    <div className="timeline-meta-item">
                      <span className="timeline-meta-icon">📅</span>
                      <span className="timeline-meta-label">Duration:</span>
                      <span className={`timeline-badge timeline-days-badge`}>
                        {task.duration} {task.duration === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <div className="timeline-meta-item">
                      <span className="timeline-meta-icon">📍</span>
                      <span className="timeline-meta-label">Timeline:</span>
                      <span className="timeline-badge">
                        Day {task.startDay + 1}-{task.endDay}
                      </span>
                    </div>
                    {task.dependsOn !== null && (
                      <div className="timeline-meta-item">
                        <span className="timeline-meta-icon">🔗</span>
                        <span className="timeline-meta-label">Depends on:</span>
                        <span className="timeline-badge">
                          Task {task.dependsOn}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-view timeline-gantt">
      <div className="timeline-header">
        <div className="timeline-header-left">
          <h3>📅 Project Timeline</h3>
          <div className="timeline-stats">
            <span className="stat-badge">
              <span className="stat-icon">📊</span>
              {totalDays} days
            </span>
            <span className="stat-badge">
              <span className="stat-icon">📆</span>
              {totalWeeks} weeks
            </span>
            <span className="stat-badge">
              <span className="stat-icon">🎯</span>
              {tasks.length} tasks
            </span>
            {criticalPath.length > 0 && (
              <span className="stat-badge critical">
                <span className="stat-icon">⚠️</span>
                {criticalPath.length} critical
              </span>
            )}
          </div>
        </div>
        <div className="timeline-controls">
          <button 
            className="view-mode-toggle"
            onClick={() => setViewMode('vertical')}
            title="Switch to vertical timeline"
          >
            <span>📋</span>
            List View
          </button>
        </div>
      </div>

      <div className="timeline-container-gantt">
        {/* Timeline Scale */}
        <div className="timeline-scale">
          <div className="timeline-scale-header">Tasks</div>
          <div className="timeline-scale-grid">
            {Array.from({ length: totalWeeks }, (_, i) => (
              <div key={i} className="timeline-week-marker">
                <span className="timeline-week-label">Week {i + 1}</span>
                <div className="timeline-days-grid">
                  {Array.from({ length: 7 }, (_, d) => {
                    const dayNum = i * 7 + d + 1;
                    if (dayNum > totalDays) return null;
                    return (
                      <div key={d} className="timeline-day-marker">
                        <span className="timeline-day-num">{dayNum}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Bars */}
        <div className="timeline-bars">
          {timelineData.map((task, index) => {
            const widthPercent = (task.duration / totalDays) * 100;
            const leftPercent = (task.startDay / totalDays) * 100;
            const colorClass = getTaskColor(task.duration);
            const isCritical = task.dependsOn !== null;
            
            return (
              <div 
                key={task._id} 
                className={`timeline-item ${hoveredTask === task._id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredTask(task._id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div className="timeline-task-info">
                  <span className="timeline-task-number">{task.order}</span>
                  <span className="timeline-task-title">{task.title}</span>
                  <span className="timeline-task-duration">
                    {task.duration}d
                  </span>
                </div>
                <div className="timeline-bar-container">
                  <div 
                    className={`timeline-bar ${colorClass} ${isCritical ? 'critical' : ''}`}
                    style={{
                      width: `${widthPercent}%`,
                      left: `${leftPercent}%`,
                      animationDelay: `${index * 0.05}s`
                    }}
                    title={`${task.title}\nDuration: ${task.duration} days\n${formatDateRange(task.startDay, task.endDay)}`}
                  >
                    <div className="timeline-bar-fill"></div>
                    <div className="timeline-bar-label">
                      {task.duration > 3 && task.title.length < 20 ? task.title : `${task.duration}d`}
                    </div>
                    {isCritical && (
                      <div className="timeline-bar-indicator" title="Has dependencies">
                        🔗
                      </div>
                    )}
                  </div>
                  {hoveredTask === task._id && (
                    <div className="timeline-tooltip">
                      <div className="tooltip-header">
                        <strong>{task.title}</strong>
                      </div>
                      <div className="tooltip-body">
                        <div className="tooltip-row">
                          <span>📅 Duration:</span>
                          <span>{task.duration} days</span>
                        </div>
                        <div className="tooltip-row">
                          <span>📍 Timeline:</span>
                          <span>Day {task.startDay + 1} - {task.endDay}</span>
                        </div>
                        <div className="tooltip-row">
                          <span>📆 Dates:</span>
                          <span>{formatDateRange(task.startDay, task.endDay)}</span>
                        </div>
                        {task.dependsOn !== null && (
                          <div className="tooltip-row">
                            <span>🔗 Depends on:</span>
                            <span>Task {task.dependsOn}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestones */}
        <div className="timeline-milestones">
          <div className="milestone start">
            <div className="milestone-marker">
              <span className="milestone-icon">🚀</span>
            </div>
            <span className="milestone-label">Project Start</span>
            <span className="milestone-date">Day 1</span>
          </div>
          <div className="milestone end">
            <div className="milestone-marker">
              <span className="milestone-icon">🎯</span>
            </div>
            <span className="milestone-label">Project Complete</span>
            <span className="milestone-date">Day {totalDays}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="timeline-legend">
          <div className="legend-title">Legend:</div>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-bar short"></div>
              <span>Quick (1-2 days)</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar medium"></div>
              <span>Medium (3-5 days)</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar long"></div>
              <span>Long (6+ days)</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar critical"></div>
              <span>Has Dependencies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineView;

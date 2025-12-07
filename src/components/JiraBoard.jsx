import { useState } from 'react';

function JiraBoard({ tasks, goalId, onTaskUpdate }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const columns = [
    { id: 'TODO', title: '📋 To Do', color: '#6b7280' },
    { id: 'IN_PROGRESS', title: '🚀 In Progress', color: '#3b82f6' },
    { id: 'IN_REVIEW', title: '👀 In Review', color: '#f59e0b' },
    { id: 'DONE', title: '✅ Done', color: '#10b981' },
    { id: 'BLOCKED', title: '🚫 Blocked', color: '#ef4444' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: '#10b981',
      MEDIUM: '#3b82f6',
      HIGH: '#f59e0b',
      URGENT: '#ef4444'
    };
    return colors[priority] || '#6b7280';
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        onTaskUpdate(updatedTask);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  return (
    <div className="jira-board">
      <div className="board-header">
        <h2>📊 Task Board</h2>
        <div className="board-stats">
          <span className="stat-badge">
            {tasks.length} tasks
          </span>
          <span className="stat-badge success">
            {tasks.filter(t => t.status === 'DONE').length} completed
          </span>
        </div>
      </div>

      <div className="board-columns">
        {columns.map(column => (
          <div key={column.id} className="board-column">
            <div className="column-header" style={{ borderTopColor: column.color }}>
              <h3>{column.title}</h3>
              <span className="task-count">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            <div className="column-tasks">
              {getTasksByStatus(column.id).map(task => (
                <div 
                  key={task._id} 
                  className="task-card-jira"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="task-card-header">
                    <span className="task-id">#{task.order}</span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <h4 className="task-card-title">{task.title}</h4>

                  {task.assignee && (
                    <div className="task-assignee">
                      <span className="assignee-avatar">
                        {task.assignee.charAt(0).toUpperCase()}
                      </span>
                      <span>{task.assignee}</span>
                    </div>
                  )}

                  {task.progress > 0 && (
                    <div className="task-progress-mini">
                      <div className="progress-bar-mini">
                        <div 
                          className="progress-fill-mini"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="progress-text-mini">{task.progress}%</span>
                    </div>
                  )}

                  {task.labels && task.labels.length > 0 && (
                    <div className="task-labels">
                      {task.labels.slice(0, 2).map((label, idx) => (
                        <span key={idx} className="label-tag">{label}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showTaskModal && selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          onClose={() => setShowTaskModal(false)}
          onUpdate={onTaskUpdate}
        />
      )}
    </div>
  );
}

function TaskDetailModal({ task, onClose, onUpdate }) {
  const [comment, setComment] = useState('');
  const [progress, setProgress] = useState(task.progress);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: comment, author: 'User' })
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        onUpdate(updatedTask);
        setComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleProgressUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: parseInt(progress) })
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        onUpdate(updatedTask);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Task #{task.order}: {task.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="task-detail-section">
            <h3>Description</h3>
            <p>{task.description}</p>
          </div>

          <div className="task-detail-section">
            <h3>Progress</h3>
            <div className="progress-control">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="progress-slider"
              />
              <span className="progress-value">{progress}%</span>
              <button onClick={handleProgressUpdate} className="btn-update">
                Update
              </button>
            </div>
          </div>

          <div className="task-detail-section">
            <h3>Comments ({task.comments?.length || 0})</h3>
            <div className="comments-list">
              {task.comments?.map((comment, idx) => (
                <div key={idx} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.author}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
            <div className="comment-input">
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
              />
              <button onClick={handleAddComment} className="btn-primary">
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JiraBoard;

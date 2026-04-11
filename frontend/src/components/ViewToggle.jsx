function ViewToggle({ currentView, onViewChange }) {
  const views = [
    { id: 'list', icon: '📋', label: 'List View' },
    { id: 'timeline', icon: '📅', label: 'Timeline' },
    { id: 'stats', icon: '📊', label: 'Statistics' }
  ];

  return (
    <div className="view-toggle">
      {views.map(view => (
        <button
          key={view.id}
          className={`view-btn ${currentView === view.id ? 'active' : ''}`}
          onClick={() => onViewChange(view.id)}
          title={view.label}
        >
          <span className="view-icon">{view.icon}</span>
          <span className="view-label">{view.label}</span>
        </button>
      ))}
    </div>
  );
}

export default ViewToggle;

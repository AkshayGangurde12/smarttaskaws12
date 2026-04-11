import { useState } from 'react';

function ExportMenu({ plan }) {
  const [isOpen, setIsOpen] = useState(false);

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(plan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportAsText = () => {
    const sortedTasks = [...plan.tasks].sort((a, b) => a.order - b.order);
    
    let text = `SMART TASK PLANNER\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Goal: ${plan.goal.text}\n`;
    text += `Created: ${new Date(plan.goal.createdAt).toLocaleString()}\n`;
    text += `Total Tasks: ${sortedTasks.length}\n\n`;
    text += `${'='.repeat(50)}\n\n`;
    
    sortedTasks.forEach((task) => {
      text += `${task.order}. ${task.title}\n`;
      text += `   ${task.description}\n`;
      text += `   Dependencies: ${task.dependsOn ? `Task ${task.dependsOn}` : 'None'}\n`;
      text += `   Estimated Days: ${task.estimatedDays || 'N/A'}\n\n`;
    });

    const dataBlob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const copyToClipboard = () => {
    const sortedTasks = [...plan.tasks].sort((a, b) => a.order - b.order);
    
    let text = `Goal: ${plan.goal.text}\n\n`;
    sortedTasks.forEach((task) => {
      text += `${task.order}. ${task.title}\n`;
      text += `   ${task.description}\n`;
      if (task.dependsOn) text += `   Depends on: Task ${task.dependsOn}\n`;
      if (task.estimatedDays) text += `   Duration: ${task.estimatedDays} days\n`;
      text += `\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      alert('Plan copied to clipboard!');
      setIsOpen(false);
    });
  };

  const printPlan = () => {
    window.print();
    setIsOpen(false);
  };

  return (
    <div className="export-menu">
      <button 
        className="export-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📥</span>
        <span>Export</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="export-dropdown">
          <button onClick={exportAsJSON} className="export-option">
            <span>📄</span>
            <div>
              <div className="export-title">Export as JSON</div>
              <div className="export-desc">Download structured data</div>
            </div>
          </button>
          
          <button onClick={exportAsText} className="export-option">
            <span>📝</span>
            <div>
              <div className="export-title">Export as Text</div>
              <div className="export-desc">Download plain text file</div>
            </div>
          </button>
          
          <button onClick={copyToClipboard} className="export-option">
            <span>📋</span>
            <div>
              <div className="export-title">Copy to Clipboard</div>
              <div className="export-desc">Copy formatted text</div>
            </div>
          </button>
          
          <button onClick={printPlan} className="export-option">
            <span>🖨️</span>
            <div>
              <div className="export-title">Print Plan</div>
              <div className="export-desc">Print or save as PDF</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default ExportMenu;

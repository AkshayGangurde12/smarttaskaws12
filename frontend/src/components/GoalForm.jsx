import { useState } from 'react';
import Button from './ui/Button';

function GoalForm({ onCreatePlan, loading, disabled }) {
  const [goalText, setGoalText] = useState('');
  const maxLength = 1000;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalText.trim() || disabled) return;
    onCreatePlan(goalText.trim());
  };

  const handleClear = () => {
    setGoalText('');
  };

  const charCount = goalText.length;
  const charCountClass = 
    charCount > maxLength ? 'error' : 
    charCount > maxLength * 0.9 ? 'warning' : '';

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      <div className="form-header">
        <span className="form-icon">✍️</span>
        <label className="label">
          What's your goal?
          <span className={`char-counter ${charCountClass}`}>
            {charCount}/{maxLength}
          </span>
        </label>
      </div>
      
      <textarea
        className="textarea"
        value={goalText}
        onChange={(e) => setGoalText(e.target.value)}
        placeholder='e.g., "Launch a mobile app in 3 months" or "Prepare for AWS certification in 6 weeks"'
        rows={4}
        maxLength={maxLength}
        disabled={disabled}
      />
      
      <div className="form-footer">
        {goalText && (
          <Button
            type="button"
            variant="secondary"
            size="medium"
            onClick={handleClear}
            disabled={disabled}
          >
            Clear
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="medium"
          icon="✨"
          iconPosition="left"
          loading={loading}
          disabled={!goalText.trim() || disabled || charCount > maxLength}
          fullWidth={!goalText}
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </Button>
      </div>
    </form>
  );
}

export default GoalForm;

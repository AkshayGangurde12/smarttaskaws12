const Goal = require('../models/Goal');
const Task = require('../models/Task');
const { generatePlan } = require('../services/llmService');

/**
 * Create a new plan using OpenAI or enhanced mock
 */
exports.createPlan = async (req, res) => {
  try {
    const { goalText } = req.body;
    const userId = req.user.id; // Get authenticated user ID

    // Validation
    if (!goalText) {
      return res.status(400).json({ message: 'goalText is required' });
    }

    if (goalText.trim().length === 0) {
      return res.status(400).json({ message: 'goalText cannot be empty' });
    }

    if (goalText.length > 1000) {
      return res.status(400).json({ 
        message: 'Goal text must not exceed 1000 characters' 
      });
    }

    // Create goal in database with user association
    const goal = await Goal.create({ 
      text: goalText,
      userId: userId 
    });

    // Generate plan using LLM service (OpenAI or enhanced mock)
    const plan = await generatePlan(goalText);

    // Prepare tasks for database with user association
    const tasksToSave = plan.tasks.map(t => ({
      userId: userId,
      goalId: goal._id,
      title: t.title,
      description: t.description || '',
      order: t.order,
      dependsOn: t.dependsOn ?? null,
      estimatedDays: t.estimatedDays ?? null
    }));

    // Save tasks to database
    const tasks = await Task.insertMany(tasksToSave);

    // Return response
    res.status(201).json({
      goal,
      tasks
    });

  } catch (error) {
    console.error('Plan creation error:', error.message);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const Task = require('../models/Task');

/**
 * Helper function to find task and verify ownership
 */
const findTaskByUser = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new Error('Task not found or you do not have permission');
  }
  return task;
};

/**
 * Get all tasks for a goal (filtered by user)
 */
exports.getTasks = async (req, res) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.id; // Get authenticated user ID
    
    // Find tasks that belong to this user and goal
    const tasks = await Task.find({ 
      goalId, 
      userId 
    }).sort({ order: 1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

/**
 * Get single task (verify ownership)
 */
exports.getTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const task = await Task.findOne({ 
      _id: req.params.id,
      userId 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

/**
 * Update task status (verify ownership)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.id;
    const task = await Task.findOne({ 
      _id: req.params.id,
      userId 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    
    // Auto-set dates based on status
    if (status === 'IN_PROGRESS' && !task.startDate) {
      task.startDate = new Date();
    }
    if (status === 'DONE') {
      task.completedDate = new Date();
      task.progress = 100;
    }
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

/**
 * Update task priority (verify ownership)
 */
exports.updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const userId = req.user.id;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      { priority },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating priority', error: error.message });
  }
};

/**
 * Assign task to user (verify ownership)
 */
exports.assignTask = async (req, res) => {
  try {
    const { assignee } = req.body;
    const userId = req.user.id;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      { assignee },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning task', error: error.message });
  }
};

/**
 * Update task progress (verify ownership)
 */
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const userId = req.user.id;
    const task = await Task.findOne({ _id: req.params.id, userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.progress = Math.min(100, Math.max(0, progress));
    
    // Auto-update status based on progress
    if (progress > 0 && progress < 100 && task.status === 'TODO') {
      task.status = 'IN_PROGRESS';
      if (!task.startDate) task.startDate = new Date();
    }
    if (progress === 100 && task.status !== 'DONE') {
      task.status = 'DONE';
      task.completedDate = new Date();
    }
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

/**
 * Add comment to task (verify ownership)
 */
exports.addComment = async (req, res) => {
  try {
    const { text, author } = req.body;
    const userId = req.user.id;
    const task = await Task.findOne({ _id: req.params.id, userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      text,
      author: author || req.user.name || 'User',
      createdAt: new Date()
    });
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

/**
 * Add/remove labels (verify ownership)
 */
exports.updateLabels = async (req, res) => {
  try {
    const { labels } = req.body;
    const userId = req.user.id;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      { labels },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating labels', error: error.message });
  }
};

/**
 * Block/unblock task (verify ownership)
 */
exports.blockTask = async (req, res) => {
  try {
    const { blocked, reason } = req.body;
    const userId = req.user.id;
    const task = await Task.findOne({ _id: req.params.id, userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (blocked) {
      task.status = 'BLOCKED';
      task.blockedReason = reason;
    } else {
      task.status = 'TODO';
      task.blockedReason = null;
    }
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error blocking task', error: error.message });
  }
};

/**
 * Get task statistics (filtered by user)
 */
exports.getStatistics = async (req, res) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.id;
    const tasks = await Task.find({ goalId, userId });
    
    const stats = {
      total: tasks.length,
      byStatus: {
        TODO: tasks.filter(t => t.status === 'TODO').length,
        IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        IN_REVIEW: tasks.filter(t => t.status === 'IN_REVIEW').length,
        DONE: tasks.filter(t => t.status === 'DONE').length,
        BLOCKED: tasks.filter(t => t.status === 'BLOCKED').length
      },
      byPriority: {
        LOW: tasks.filter(t => t.priority === 'LOW').length,
        MEDIUM: tasks.filter(t => t.priority === 'MEDIUM').length,
        HIGH: tasks.filter(t => t.priority === 'HIGH').length,
        URGENT: tasks.filter(t => t.priority === 'URGENT').length
      },
      averageProgress: tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length || 0,
      completionRate: (tasks.filter(t => t.status === 'DONE').length / tasks.length * 100) || 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

const Task = require('../models/Task');

/**
 * Get all tasks for a goal
 */
exports.getTasks = async (req, res) => {
  try {
    const { goalId } = req.params;
    const tasks = await Task.find({ goalId }).sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

/**
 * Get single task
 */
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

/**
 * Update task status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    
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
 * Update task priority
 */
exports.updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
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
 * Assign task to user
 */
exports.assignTask = async (req, res) => {
  try {
    const { assignee } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
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
 * Update task progress
 */
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const task = await Task.findById(req.params.id);
    
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
 * Add comment to task
 */
exports.addComment = async (req, res) => {
  try {
    const { text, author } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      text,
      author: author || 'User',
      createdAt: new Date()
    });
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

/**
 * Add/remove labels
 */
exports.updateLabels = async (req, res) => {
  try {
    const { labels } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
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
 * Block/unblock task
 */
exports.blockTask = async (req, res) => {
  try {
    const { blocked, reason } = req.body;
    const task = await Task.findById(req.params.id);
    
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
 * Get task statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    const { goalId } = req.params;
    const tasks = await Task.find({ goalId });
    
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

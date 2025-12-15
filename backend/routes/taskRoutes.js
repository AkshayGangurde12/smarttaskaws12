const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Protect all task routes - require authentication
router.use(protect);

// Get all tasks for a goal
router.get('/goal/:goalId', taskController.getTasks);

// Get single task
router.get('/:id', taskController.getTask);

// Update task status
router.patch('/:id/status', taskController.updateStatus);

// Update task priority
router.patch('/:id/priority', taskController.updatePriority);

// Assign task
router.patch('/:id/assign', taskController.assignTask);

// Update progress
router.patch('/:id/progress', taskController.updateProgress);

// Add comment
router.post('/:id/comments', taskController.addComment);

// Update labels
router.patch('/:id/labels', taskController.updateLabels);

// Block/unblock task
router.patch('/:id/block', taskController.blockTask);

// Get statistics
router.get('/goal/:goalId/statistics', taskController.getStatistics);

module.exports = router;

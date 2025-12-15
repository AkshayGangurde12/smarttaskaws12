
const express = require('express');
const router = express.Router();
const { createPlan } = require('../controllers/planController');
const { protect } = require('../middleware/auth');

// Protect all routes - require authentication
router.post('/', protect, createPlan);

module.exports = router;

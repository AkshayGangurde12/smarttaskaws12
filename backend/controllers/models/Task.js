
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  title: { type: String, required: true },
  description: String,
  order: Number,
  dependsOn: Number,
  estimatedDays: Number,
  dueDate: Date
});

module.exports = mongoose.model('Task', taskSchema);

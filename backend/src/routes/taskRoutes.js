const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  startTimer,
  stopTimer,
  clearAllTasks,
} = require('../controllers/taskController');
const {
  validateTask,
  validateTaskPartial,
  validateTaskFilters,
  validateIdParam,
  handleValidationErrors,
} = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes are prefixed with /api/tasks

// GET /api/tasks - Get all tasks with filtering
router.get(
  '/',
  authenticateToken,
  validateTaskFilters,
  handleValidationErrors,
  getTasks
);

// GET /api极/tasks/stats - Get task statistics
router.get(
  '/stats',
  authenticateToken,
  getTaskStats
);

// GET /api/tasks/:id - Get single task
router.get(
  '/:id',
  authenticateToken,
  validateIdParam,
  handleValidationErrors,
  getTask
);

// POST /api/tasks - Create new task
router.post(
  '/',
  authenticateToken,
  validateTask,
  handleValidationErrors,
  createTask
);

// PUT /api/tasks/:id - Update task
router.put(
  '/:id',
  authenticateToken,
  validateIdParam,
  validateTaskPartial,
  handleValidationErrors,
  updateTask
);

// DELETE /api/tasks/:id - Delete task
router.delete(
  '/:id',
  authenticateToken,
  validateIdParam,
  handleValidationErrors,
  deleteTask
);

// POST /api/tasks/:id/timer/start - Start task timer
router.post(
  '/:id/timer/start',
  authenticateToken,
  validateIdParam,
  handleValidationErrors,
  startTimer
);

// POST /api/tasks/:id/timer/stop - Stop task timer
router.post(
  '/:id/timer/stop',
  authenticateToken,
  validateIdParam,
  handleValidationErrors,
  stopTimer
);

// DELETE /api/tasks - Clear all tasks (development only)
router.delete(
  '/',
  clearAllTasks
);

module.exports = router;
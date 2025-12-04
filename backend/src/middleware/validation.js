const { body, query, param, validationResult } = require('express-validator');

const validateTask = [
  body('title')
    .optional()
    .customSanitizer(value => {
      // Convert empty strings to undefined so they're treated as missing
      if (value === '' || (value && value.trim() === '')) {
        return undefined;
      }
      return value;
    })
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Title must be between 1 and 500 characters'),
  
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Task text is required'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag cannot exceed 50 characters'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
  body('estimatedTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estimated time must be a positive number'),
  
  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),
  
  body('recurringPattern')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Recurring pattern must be one of: daily, weekly, monthly'),
  
  body('subtasks')
    .optional()
    .isArray()
    .withMessage('Subtasks must be an array'),
  
  body('subtasks.*.text')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subtask text must be between 1 and 200 characters'),
  
  body('subtasks.*.completed')
    .optional()
    .isBoolean()
    .withMessage('Subtask completed must be a boolean'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

// Partial validation for updates (all fields optional)
const validateTaskPartial = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Title must be between 1 and 500 characters'),
  
  body('text')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Task text must not be empty if provided'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag cannot exceed 50 characters'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
  body('estimatedTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estimated time must be a positive number'),
  
  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),
  
  body('recurringPattern')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Recurring pattern must be one of: daily, weekly, monthly'),
  
  body('subtasks')
    .optional()
    .isArray()
    .withMessage('Subtasks must be an array'),
  
  body('subtasks.*.text')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subtask text must be between 1 and 200 characters'),
  
  body('subtasks.*.completed')
    .optional()
    .isBoolean()
    .withMessage('Subtask completed must be a boolean'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

const validateTaskFilters = [
  query('searchText')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search text cannot exceed 100 characters'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority filter must be one of: low, medium, high'),
  
  query('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category filter cannot exceed 100 characters'),
  
  query('status')
    .optional()
    .isIn(['completed', 'pending', 'overdue'])
    .withMessage('Status filter must be one of: completed, pending, overdue'),
  
  query('tags')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === 'string') return true;
      throw new Error('Tags filter must be a string or array');
    }),
];

const validateIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID format'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

module.exports = {
  validateTask,
  validateTaskPartial,
  validateTaskFilters,
  validateIdParam,
  handleValidationErrors,
};
// API Response Constants
const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

const API_RESPONSE = {
  SUCCESS: 'success',
  ERROR: 'error',
  FAIL: 'fail',
};

// Task Constants
const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

const RECURRING_PATTERNS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

const TASK_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  OVERDUE: 'overdue',
};

// Validation Constants
const VALIDATION = {
  TITLE_MAX_LENGTH: 500,
  NOTES_MAX_LENGTH: 1000,
  TAG_MAX_LENGTH: 50,
  CATEGORY_MAX_LENGTH: 100,
  SEARCH_MAX_LENGTH: 100,
};

// Pagination Constants
const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
};

module.exports = {
  HTTP_STATUS,
  API_RESPONSE,
  PRIORITY,
  RECURRING_PATTERNS,
  TASK_STATUS,
  VALIDATION,
  PAGINATION,
};
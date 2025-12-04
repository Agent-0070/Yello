const { PAGINATION } = require('./constants');

/**
 * Format API response
 */
const formatResponse = (success = true, data = {}, message = '', statusCode = 200) => {
  return {
    success,
    message,
    data,
    statusCode,
  };
};

/**
 * Format error response
 */
const formatError = (message = 'An error occurred', statusCode = 500, errors = []) => {
  return {
    success: false,
    message,
    errors,
    statusCode,
  };
};

/**
 * Sanitize object - remove undefined and null values
 */
const sanitizeObject = (obj) => {
  const sanitized = { ...obj };
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined || sanitized[key] === null) {
      delete sanitized[key];
    }
  });
  return sanitized;
};

/**
 * Build pagination options from query parameters
 */
const buildPaginationOptions = (query) => {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Build sorting options from query parameters
 */
const buildSortOptions = (query, defaultSort = 'createdAt', defaultOrder = 'desc') => {
  const sortBy = query.sortBy || defaultSort;
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  return { [sortBy]: sortOrder };
};

/**
 * Calculate pagination metadata
 */
const buildPaginationMetadata = (data, total, page, limit) => {
  return {
    count: data.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
};

/**
 * Generate a random color for visual elements
 */
const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', '#AB47BC',
    '#66BB6A', '#EF5350', '#29B6F6', '#FFA726', '#7E57C2',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Format date to readable string
 */
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate time difference in minutes
 */
const calculateTimeDifference = (startDate, endDate = new Date()) => {
  return Math.round((endDate - startDate) / 60000); // minutes
};

module.exports = {
  formatResponse,
  formatError,
  sanitizeObject,
  buildPaginationOptions,
  buildSortOptions,
  buildPaginationMetadata,
  generateRandomColor,
  formatDate,
  calculateTimeDifference,
};
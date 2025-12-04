const Task = require('../models/Task');

// Get all tasks with filtering and pagination
const getTasks = async (req, res, next) => {
  try {
    const {
      searchText,
      priority,
      category,
      status,
      tags,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object - only show tasks for the authenticated user
    const filter = { user: req.user._id };

    // Text search across multiple fields
    if (searchText) {
      filter.$or = [
        { text: { $regex: searchText, $options: 'i' } },
        { category: { $regex: searchText, $options: 'i' } },
        { tags: { $in: [new RegExp(searchText, 'i')] } }
      ];
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Status filter
    if (status) {
      const now = new Date();
      switch (status) {
        case 'completed':
          filter.completed = true;
          break;
        case 'pending':
          filter.completed = false;
          break;
        case 'overdue':
          filter.completed = false;
          filter.dueDate = { $lt: now };
          break;
      }
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray.map(tag => new RegExp(tag, 'i')) };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      count: tasks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get single task
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Create new task
const createTask = async (req, res, next) => {
  try {
    // Check if text field is provided and valid
    if (!req.body.text || typeof req.body.text !== 'string' || req.body.text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task text is required',
        errors: [{
          field: 'text',
          message: 'Task text is required'
        }]
      });
    }

    const taskData = {
      ...req.body,
      user: req.user._id, // Add user reference
      // Ensure required fields with proper handling
      title: (req.body.title && req.body.title.trim()) ? req.body.title.trim() : req.body.text.substring(0, 100),
      text: req.body.text.trim(),
    };

    // Remove any undefined or null values to avoid validation errors
    Object.keys(taskData).forEach(key => {
      if (taskData[key] === undefined || taskData[key] === null) {
        delete taskData[key];
      }
    });

    // Convert dueDate to Date object if provided (handle both string and Date objects)
    if (taskData.dueDate) {
      if (typeof taskData.dueDate === 'string') {
        taskData.dueDate = new Date(taskData.dueDate);
      } else if (taskData.dueDate instanceof Date) {
        // Already a Date object, keep as is
        taskData.dueDate = taskData.dueDate;
      }
      // Handle invalid dates
      if (isNaN(taskData.dueDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid due date format',
          errors: [{
            field: 'dueDate',
            message: 'Invalid date format'
          }]
        });
      }
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    
    next(error);
  }
};

// Update task
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Get task statistics
const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.getStats();
    
    // Additional stats calculations
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const [recentTasks, dueSoonTasks] = await Promise.all([
      Task.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
      Task.countDocuments({
        completed: false,
        dueDate: { 
          $gte: now, 
          $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) 
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        ...stats,
        recent: recentTasks,
        dueSoon: dueSoonTasks,
        pending: stats.total - stats.completed
      }
    });
  } catch (error) {
    next(error);
  }
};

// Start task timer
const startTimer = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.startTimer();

    res.json({
      success: true,
      data: task,
      message: 'Timer started'
    });
  } catch (error) {
    next(error);
  }
};

// Stop task timer
const stopTimer = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.stopTimer();

    res.json({
      success: true,
      data: task,
      message: 'Timer stopped and time recorded'
    });
  } catch (error) {
    next(error);
  }
};

// Clear all tasks (for development/testing)
const clearAllTasks = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        success: false,
        message: 'This operation is only allowed in development mode'
      });
    }

    await Task.deleteMany({});
    
    res.json({
      success: true,
      message: 'All tasks cleared',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  startTimer,
  stopTimer,
  clearAllTasks,
};
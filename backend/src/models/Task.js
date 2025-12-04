const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  dueDate: {
    type: Date,
  },
  estimatedTime: {
    type: Number, // minutes
    min: 0,
  },
  actualTime: {
    type: Number, // minutes
    default: 0,
    min: 0,
  },
  timeStarted: {
    type: Date,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
  },
  subtasks: [subTaskSchema],
  notes: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return this.dueDate < new Date();
});

// Virtual for checking if task is due soon (within 24 hours)
taskSchema.virtual('isDueSoon').get(function() {
  if (!this.dueDate || this.completed) return false;
  const now = new Date();
  const timeUntilDue = this.dueDate.getTime() - now.getTime();
  return timeUntilDue > 0 && timeUntilDue <= 24 * 60 * 60 * 1000;
});

// Indexes for better query performance
taskSchema.index({ completed: 1, dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ user: 1 });

// Static method to get task statistics
taskSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] } },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$completed', false] },
                  { $lt: ['$dueDate', new Date()] }
                ]
              },
              1,
              0
            ]
          }
        },
        highPriority: {
          $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
        },
      }
    }
  ]);

  return stats[0] || { total: 0, completed: 0, overdue: 0, highPriority: 0 };
};

// Instance method to start timer
taskSchema.methods.startTimer = function() {
  if (this.timeStarted) {
    throw new Error('Timer is already running');
  }
  this.timeStarted = new Date();
  return this.save();
};

// Instance method to stop timer and update actual time
taskSchema.methods.stopTimer = function() {
  if (!this.timeStarted) {
    throw new Error('No timer is running');
  }
  
  const timeSpent = Math.round((new Date() - this.timeStarted) / 60000); // minutes
  this.actualTime = (this.actualTime || 0) + timeSpent;
  this.timeStarted = undefined;
  
  return this.save();
};

module.exports = mongoose.model('Task', taskSchema);
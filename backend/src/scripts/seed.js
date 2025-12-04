const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');
const Task = require('../models/Task');

const sampleTasks = [
  {
    title: 'Complete React project',
    text: 'Finish the main functionality of the React task management app',
    priority: 'high',
    category: 'Development',
    tags: ['react', 'javascript', 'frontend'],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    estimatedTime: 120,
    subtasks: [
      { text: 'Set up component structure', completed: true },
      { text: 'Implement drag and drop', completed: false },
      { text: 'Add dark mode support', completed: false },
    ],
    notes: 'This is a high priority task for the main project',
  },
  {
    title: 'Write documentation',
    text: 'Create comprehensive documentation for the API',
    priority: 'medium',
    category: 'Documentation',
    tags: ['docs', 'api', 'backend'],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    estimatedTime: 60,
    notes: 'Include examples and usage guidelines',
  },
  {
    title: 'Fix responsive design issues',
    text: 'Address mobile responsiveness problems in the UI',
    priority: 'medium',
    category: 'Design',
    tags: ['css', 'responsive', 'ui'],
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    estimatedTime: 45,
    subtasks: [
      { text: 'Test on mobile devices', completed: true },
      { text: 'Fix navbar layout', completed: false },
      { text: 'Adjust form inputs', completed: false },
    ],
  },
  {
    title: 'Set up testing environment',
    text: 'Configure Jest and React Testing Library',
    priority: 'low',
    category: 'Testing',
    tags: ['jest', 'testing', 'quality'],
    estimatedTime: 90,
    notes: 'Focus on component testing and integration tests',
  },
  {
    title: 'Optimize database queries',
    text: 'Improve MongoDB query performance',
    priority: 'high',
    category: 'Backend',
    tags: ['mongodb', 'performance', 'optimization'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    estimatedTime: 180,
    subtasks: [
      { text: 'Analyze current queries', completed: true },
      { text: 'Add indexes', completed: true },
      { text: 'Test performance improvements', completed: false },
    ],
  },
  {
    title: 'Learn TypeScript advanced features',
    text: 'Study generics and advanced type patterns',
    priority: 'low',
    category: 'Learning',
    tags: ['typescript', 'learning', 'skills'],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    estimatedTime: 240,
    notes: 'Focus on practical applications in React projects',
  },
  {
    title: 'Review code with team',
    text: 'Schedule code review session with development team',
    priority: 'medium',
    category: 'Team',
    tags: ['code-review', 'collaboration', 'quality'],
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    estimatedTime: 60,
  },
  {
    title: 'Update dependencies',
    text: 'Check and update project dependencies to latest versions',
    priority: 'low',
    category: 'Maintenance',
    tags: ['dependencies', 'updates', 'security'],
    estimatedTime: 30,
    notes: 'Check for breaking changes before updating',
  },
  {
    title: 'Create deployment pipeline',
    text: 'Set up CI/CD pipeline for automatic deployments',
    priority: 'high',
    category: 'DevOps',
    tags: ['ci-cd', 'deployment', 'automation'],
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    estimatedTime: 120,
    subtasks: [
      { text: 'Set up GitHub Actions', completed: false },
      { text: 'Configure staging environment', completed: false },
      { text: 'Test deployment process', completed: false },
    ],
  },
  {
    title: 'Write unit tests',
    text: 'Add comprehensive unit tests for utility functions',
    priority: 'medium',
    category: 'Testing',
    tags: ['jest', 'unit-testing', 'quality'],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    estimatedTime: 90,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing tasks...');
    await Task.deleteMany({});
    
    // Insert sample data
    console.log('📝 Inserting sample tasks...');
    const tasks = await Task.insertMany(sampleTasks);
    
    console.log(`✅ Successfully seeded ${tasks.length} tasks`);
    console.log('📊 Sample tasks created:');
    
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.priority} priority)`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Disconnect from database
    await disconnectDB();
    console.log('👋 Database connection closed');
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleTasks };
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB, isConnected } = require('./src/config/database');
const config = require('./src/config/environment');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const taskRoutes = require('./src/routes/taskRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// If the DB is not connected, respond with 503 for API routes so the frontend
// receives a clear, machine-readable error instead of the process exiting.
app.use((req, res, next) => {
  // Only gate API endpoints (don't block health checks or static assets)
  if (req.path.startsWith(config.api.prefix) && !isConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Service unavailable: database not connected',
    });
  }
  next();
});

// Middleware: use the centralized CORS config from src/config/environment.js
app.use(cors(config.cors));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use(`${config.api.prefix}/auth`, authRoutes);
app.use(`${config.api.prefix}/tasks`, taskRoutes);

// Public test endpoint — useful to verify frontend <> backend connectivity (CORS, routing)
app.get(`${config.api.prefix}/test`, (req, res) => {
  res.json({
    success: true,
    message: 'Hello from backend!',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint - Redirect to API or show welcome message
app.get('/', (req, res) => {
  res.redirect(`${config.api.prefix}`);
});

// Welcome endpoint
app.get(config.api.prefix, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to iNote API',
    version: '1.0.0',
    endpoints: {
      tasks: `${config.api.prefix}/tasks`,
      health: '/health',
      documentation: 'Coming soon...',
    },
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🚨 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🚨 Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

// Start server (robust)
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

const PORT = normalizePort(process.env.PORT || config.port || 3000);
app.set('port', PORT);

const server = app.listen(PORT);

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`\n🚀 iNote Server Started!`);
  console.log(`📍 ${bind}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  if (typeof addr === 'object' && addr && addr.port) {
    console.log(`📊 API: http://localhost:${addr.port}${config.api.prefix}`);
    console.log(`❤️  Health: http://localhost:${addr.port}/health\n`);
  }
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;

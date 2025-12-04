const path = require('path');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production'
  ? '../../.env.production'
  : '../../.env';

require('dotenv').config({
  path: path.resolve(__dirname, envFile),
  override: true // Allow environment variables to be overridden
});

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskdb',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/test_taskdb',
  },
  
  // CORS configuration
  // FRONTEND_URL may be a single origin or a comma-separated list of origins
  cors: (function () {
    const frontendEnv = process.env.FRONTEND_URL || '';
    const frontendOrigins = frontendEnv
      ? frontendEnv.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    return {
      origin: [
        ...frontendOrigins,
        'http://localhost:5173',
        'http://localhost:5174',
        // Also accept the alternative Vite port if Vite falls back from 8080 to 8081
        'http://localhost:8081',
      ].filter(Boolean),
      credentials: true,
    };
  })(),
  
  // API configuration
  api: {
    prefix: process.env.API_PREFIX || '/api',
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-fallback-secret-for-development-only',
    expiresIn: '7d',
  },

  // Cookie configuration
  cookie: {
    secret: process.env.COOKIE_SECRET || 'your-cookie-secret-for-development',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // In production you can choose to enable cross-site cookies by setting
      // USE_SAMESITE_NONE=true in Render environment variables.
      sameSite:
        process.env.NODE_ENV === 'production'
          ? process.env.USE_SAMESITE_NONE === 'true'
            ? 'none'
            : 'strict'
          : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
  
  // Validation
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
  
  get isProduction() {
    return this.nodeEnv === 'production';
  },
};

module.exports = config;

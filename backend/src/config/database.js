const mongoose = require('mongoose');
const config = require('./environment');

const connectDB = async () => {
  try {
    const dbUri = config.isDevelopment ? config.mongodb.testUri : config.mongodb.uri;
    const dbName = config.isDevelopment ? 'test_iNote' : 'iNote-prod';
    
    console.log(`Attempting to connect to ${config.isDevelopment ? 'TEST' : 'PRODUCTION'} database...`);
    console.log(`Database: ${dbName}`);
    console.log(`Connection URI: ${dbUri.replace(/:[^:]*@/, ':****@')}`); // Hide password from logs

    const conn = await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.db.databaseName}`);
    console.log(`   Environment: ${config.isDevelopment ? 'Development' : 'Production'}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Critical Error connecting to MongoDB:');
    console.error('   Error details:', error.message);
    console.error('   Connection URI used:', config.isDevelopment ? 'Test Database' : 'Production Database');
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('   Issue: Cannot connect to MongoDB server');
      console.error('   Check if:');
      console.error('     - MongoDB Atlas cluster is running');
      console.error('     - IP is whitelisted in Atlas');
      console.error('     - Database credentials are correct');
      console.error('     - Network connectivity exists');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('   Issue: MongoDB server selection failed');
    } else if (error.name === 'MongoNetworkError') {
      console.error('   Issue: Network connectivity problem');
    }
    
    console.error('   Continuing without DB connection. The server will respond with 503 to API requests until the DB is available.');
    // Do not exit the process here. Allow the server to start so we can return
    // graceful 503 responses and enable local development even when the DB
    // (e.g., Atlas) is temporarily unreachable. The application can retry
    // connecting if desired or an operator can fix network/whitelist issues.
    return null;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  disconnectDB,
  isConnected,
  mongoose,
};
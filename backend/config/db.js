const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Only connect if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MongoDB URI not provided. Chat API will work without database.'.yellow);
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error('⚠️  Database connection error (Chat API will still work):', error.message.yellow);
    // Don't exit - allow server to run without DB for chat functionality
    console.log('💡 Chat API endpoints will work without MongoDB connection.'.yellow);
  }
};

module.exports = connectDB;

/**
 * Server Entry Point
 * Location: src/server.js
 */

// 🔹 Force-load .env from project root (Windows-safe)
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

// 🔹 Core imports
const app = require('./app');
const connectDB = require('./config/db');
const { initializeFirebase } = require('./config/firebaseAdmin');
const { initializeCronJobs } = require('./config/cron');
const logger = require('./utils/logger');

// 🔹 Config
const PORT = process.env.PORT || 5000;

// 🔹 Bootstrap server
const startServer = async () => {
  try {
    // Validate ENV early
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    // Connect to MongoDB
    await connectDB();

    // Init Firebase Admin (SAFE)
    const firebaseApp = initializeFirebase();
    if (process.env.ENABLE_FIREBASE === 'true' && !firebaseApp) {
      throw new Error('Firebase is enabled but failed to initialize');
    }

    // Init Cron Jobs
    initializeCronJobs();

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(
        `API URL: http://localhost:${PORT}${process.env.API_PREFIX || '/api'}`
      );
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// 🔹 Process-level safety
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Promise Rejection: ${err.message}`);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// 🔹 Start application
startServer();

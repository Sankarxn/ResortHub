import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  // Connect to MongoDB Atlas
  await connectDB();

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  ResortHub Backend Server Running!`);
    console.log(`  Local URL:   http://localhost:${PORT}`);
    console.log(`  Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });
};

startServer();

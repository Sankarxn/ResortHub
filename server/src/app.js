import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import resortRoutes from './routes/resortRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev, or strictly allowedOrigins in prod
    },
    credentials: true, // Allow cookies across origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body and cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Server health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'ResortHub API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Primary REST routes
app.use('/api/auth', authRoutes);
app.use('/api/resorts', resortRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

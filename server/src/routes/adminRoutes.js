import express from 'express';
import {
  getAdminDashboardStats,
  getAdminRooms,
  addRoomToResort,
  updateRoomInResort,
  deleteRoomFromResort,
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Strict security: all admin routes require both authentication AND admin role
router.use(requireAuth, requireAdmin);

// Dashboard statistics
router.get('/dashboard', getAdminDashboardStats);

// List all rooms across resorts
router.get('/rooms', getAdminRooms);

// Add new room to specific resort
router.post('/resorts/:resortId/rooms', addRoomToResort);

// Update specific room inside resort
router.put('/resorts/:resortId/rooms/:roomId', updateRoomInResort);

// Delete specific room inside resort
router.delete('/resorts/:resortId/rooms/:roomId', deleteRoomFromResort);

export default router;

import express from 'express';
import {
  getAllResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from '../controllers/resortController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Discovery endpoints
router.get('/', getAllResorts);
router.get('/:id', getResortById);

// Protected Admin endpoints for property management
router.post('/', requireAuth, requireAdmin, createResort);
router.put('/:id', requireAuth, requireAdmin, updateResort);
router.delete('/:id', requireAuth, requireAdmin, deleteResort);

export default router;

import express from 'express';
import {
  findFirstAvailableRoom,
  getAllRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom
} from '../controller/roomController.js';

const router = express.Router();

// סדר קריטי! הספציפי (search) תמיד מעל הכללי (:id)
router.get('/search', findFirstAvailableRoom);
router.get('/', getAllRooms);
router.post('/', createRoom);
router.get('/:id', getRoomById);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
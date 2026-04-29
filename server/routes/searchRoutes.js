import express from 'express';
import {
  
  getAllRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom
} from '../controller/roomController.js';
import { findFirstAvailableRoom } from '../Controller/RoomSearch.js';

const router = express.Router();

// סדר קריטי! הספציפי (search) תמיד מעל הכללי (:id)
router.get('/search', findFirstAvailableRoom);
router.get('/', getAllRooms);
router.post('/', createRoom);
router.get('/:id', getRoomById);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
import express from 'express';
import { createRoom, deleteRoom, findFirstAvailableRoom, getAllRooms, getRoomById, updateRoom } from '../Controller/roomController.js';


const router = express.Router();

// סדר קריטי! הספציפי (search) תמיד מעל הכללי (:id)
router.get('/search', findFirstAvailableRoom);
router.get('/', getAllRooms);
router.post('/', createRoom);
router.get('/:id', getRoomById);
router.put('/:id',updateRoom);
router.delete('/:id', deleteRoom);

export default router;
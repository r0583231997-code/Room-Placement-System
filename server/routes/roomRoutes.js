import express from 'express';
import { createRoom, deleteRoom, findFirstAvailableRoom, getAllRooms, getRoomById, updateRoom, clearRoomPlacements, clearAllRoomsPlacements } from '../Controller/roomController.js';

const router = express.Router();

// סדר קריטי! הספציפי (search) תמיד מעל הכללי (:id)
router.get('/search', findFirstAvailableRoom);
router.delete('/clear-all-placements', clearAllRoomsPlacements);
router.get('/', getAllRooms);
router.post('/', createRoom);
router.get('/:id', getRoomById);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);
router.delete('/:id/clear-placements', clearRoomPlacements);

export default router;
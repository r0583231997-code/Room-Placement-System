import express from 'express';
import { createRoom, deleteRoom, findFirstAvailableRoom, getAllRooms, getRoomById, updateRoom, clearRoomPlacements, getAllAvailableRooms } from '../Controller/roomController.js';import validateWingAndFloor from '../Middleware.js';
const router = express.Router();

// סדר קריטי! הספציפי (search) תמיד מעל הכללי (:id)
router.get('/search', validateWingAndFloor, findFirstAvailableRoom);
router.get('/available', validateWingAndFloor, getAllAvailableRooms);
router.get('/', getAllRooms);
router.post('/', createRoom);
router.get('/:id', getRoomById);
router.put('/:id', validateWingAndFloor, updateRoom);
router.delete('/:id', validateWingAndFloor, deleteRoom);
router.delete('/:id/clear-placements', validateWingAndFloor, clearRoomPlacements);

export default router;
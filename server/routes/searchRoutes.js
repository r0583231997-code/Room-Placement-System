import express from 'express';
import { findFirstAvailableRoom } from '../controller/RoomSearch.js';
import validateWingAndFloor from '../middleware/validateWingAndFloor.js';

const router = express.Router();

// חיפוש חדר פנוי
router.get('/', validateWingAndFloor, findFirstAvailableRoom);

export default router;
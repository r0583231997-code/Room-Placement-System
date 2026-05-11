import express from 'express';
import { 
  createCancellation, 
  getAllCancellations, 
  deleteCancellation,
  getCancellationsByRoom
} from '../controller/cancellationController.js';

const router = express.Router();

// יצירת ביטול
router.post('/', createCancellation);

// קבלת כל הביטולים
router.get('/', getAllCancellations);

// מחיקת ביטול לפי ID
router.delete('/:id', deleteCancellation);
router.get('/room/:roomId', getCancellationsByRoom);
export default router;
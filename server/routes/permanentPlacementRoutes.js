import express from 'express';
import {
  getAllPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
  getPlacementsByRoom // <-- הוספנו את הייבוא הזה
} from '../Controller/permanentPlacementController.js';

const router = express.Router();

router.get('/room/:roomId', getPlacementsByRoom); // <-- הנתיב החדש
router.get('/', getAllPlacements);
router.post('/', createPlacement);
router.put('/:id', updatePlacement);
router.delete('/:id', deletePlacement);

export default router;
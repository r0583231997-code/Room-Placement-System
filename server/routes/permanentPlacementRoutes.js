import express from 'express';
import {
  getAllPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement
} from '../Controller/permanentPlacementController.js';

const router = express.Router();

router.get('/', getAllPlacements);
router.post('/', createPlacement);
router.put('/:id', updatePlacement);
router.delete('/:id', deletePlacement);

export default router;
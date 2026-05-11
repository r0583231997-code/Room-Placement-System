import express from 'express';
import { 
    createTempPlacement, 
    getTempPlacementsByRoom,
    deleteTempPlacement
} from '../controller/temporaryPlacementController.js';

const router = express.Router();

router.get('/room/:roomId', getTempPlacementsByRoom);
router.post('/', createTempPlacement);
router.delete('/:id', deleteTempPlacement);

export default router;
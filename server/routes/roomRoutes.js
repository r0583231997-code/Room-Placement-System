const express = require('express');
const router = express.Router();
const roomController = require('../controller/roomController');

// סדר קריטי! הספציפי (search) תמיד מעל הכללי (:id)
router.get('/search', roomController.findFirstAvailableRoom);
router.get('/', roomController.getAllRooms);
router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
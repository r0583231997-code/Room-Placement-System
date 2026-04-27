const express = require('express');
const router = express.Router();
const cancelController = require('../controller/cancellationController');

// נתיב ליצירת ביטול: POST /api/cancellations
router.post('/', cancelController.createCancellation);

// נתיב לקבלת כל הביטולים: GET /api/cancellations
router.get('/', cancelController.getAllCancellations);

// נתיב למחיקת ביטול לפי ID: DELETE /api/cancellations/:id
router.delete('/:id', cancelController.deleteCancellation);

module.exports = router;
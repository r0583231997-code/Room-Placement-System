const Cancellation = require('../models/Cancellation');

// 1. יצירת ביטול חדש
exports.createCancellation = async (req, res) => {
  try {
    const newCancellation = new Cancellation(req.body);
    await newCancellation.save();
    res.status(201).json(newCancellation);
  } catch (error) {
    res.status(400).json({ message: "שגיאה ביצירת ביטול: " + error.message });
  }
};

// 2. קבלת כל הביטולים
exports.getAllCancellations = async (req, res) => {
  try {
    const cancellations = await Cancellation.find().populate('room'); // populate מביא גם את פרטי החדר
    res.json(cancellations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. מחיקת ביטול (ביטול ה"ביטול")
exports.deleteCancellation = async (req, res) => {
  try {
    const deleted = await Cancellation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'הביטול לא נמצא' });
    res.json({ message: 'הביטול נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
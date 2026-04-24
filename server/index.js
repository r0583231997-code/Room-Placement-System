require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // הוספת ספרייה לחיבור למסד הנתונים
const cors = require('cors'); // מאפשר ל-React לתקשר עם השרת
const Room = require('./models/Room'); // ייבוא המודל של החדר
const PermanentPlacement = require('./models/PermanentPlacement');
const TemporaryPlacement = require('./models/TemporaryPlacement');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // מאפשר לשרת לקרוא מידע בפורמט JSON

// חיבור למסד הנתונים MongoDB 
// החליפו את המחרוזת למטה בקישור האמיתי מה-MongoDB Atlas שלכן
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// נתיב לבדיקה (מה שהיה לך קודם)
app.get('/', (req, res) => {
  res.send('Server is running and connected to DB!');
});

// נתיב לשליפת כל החדרים לצורך שיבוץ [cite: 7, 9]
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find(); // שליפת הנתונים בפועל [cite: 9]
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "שגיאה בשליפת החדרים" });
  }
});
// ===========
// POST - יצירת חדר חדש
app.post('/api/rooms', async (req, res) => {
  try {
    const room = new Room(req.body);
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - חדר לפי ID
app.get('/api/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - עדכון חדר
app.put('/api/rooms/:id', async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Room not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - מחיקת חדר
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ===================
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
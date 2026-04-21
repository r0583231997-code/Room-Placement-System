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
mongoose.connect('mongodb+srv://s0548474312_db_user:Seminar123@cluster0.n1guyzq.mongodb.net/?appName=Cluster0')
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

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// ייבוא ה-Routes
import cancellationRoutes from './routes/cancellationRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import permanentPlacementRoutes from './routes/permanentPlacementRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import temporaryPlacementRoutes from './routes/temporaryPlacementRoutes.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// --- הגדרת הנתיבים (Routes) ---

app.get('/', (req, res) => res.send('Server is running and connected to DB!'));
app.get('/test', (req, res) => res.send("השרת מזהה נתיבים חדשים!"));

// חיבור הראוטים
app.use('/api/rooms', roomRoutes);
app.use('/api/cancellations', cancellationRoutes);
app.use('/api/permanent-placements', permanentPlacementRoutes);
app.use('/api/temporary-placements', temporaryPlacementRoutes);// הפעלת השרת
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
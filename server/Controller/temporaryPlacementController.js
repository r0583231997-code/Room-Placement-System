import TemporaryPlacement from '../models/TemporaryPlacement.js';

export const getTempPlacementsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { date } = req.query; // אפשרות לסנן לפי תאריך

    let query = { room: roomId };
    if (date) {
        // חיפוש מתחילת היום עד סופו
        const searchDate = new Date(date);
        query.date = {
            $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
            $lte: new Date(searchDate.setHours(23, 59, 59, 999))
        };
    }

    const placements = await TemporaryPlacement.find(query);
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTempPlacement = async (req, res) => {
  try {
    const placement = new TemporaryPlacement(req.body);
    const newPlacement = await placement.save();
    res.status(201).json(newPlacement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTempPlacement = async (req, res) => {
    try {
      const deleted = await TemporaryPlacement.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'לא נמצא שיבוץ זמני' });
      res.json({ message: 'נמחק בהצלחה' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
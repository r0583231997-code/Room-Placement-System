const Room = require('../models/Room');
const PermanentPlacement = require('../models/PermanentPlacement');
const TemporaryPlacement = require('../models/TemporaryPlacement');

const findFirstAvailableRoom = async (req, res) => {
  try {
    const { date, startTime, endTime, minSize, wing, floor, hasProjector } = req.query;
    const searchDate = new Date(date);
    const dayOfWeek = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'][searchDate.getDay()];

    // 1. הגדרת השאילתה לסינון המאפיינים הפיזיים של החדר 
    let query = {};
    if (minSize) query.size = { $gte: Number(minSize) };
    if (wing) query.wing = wing;
    if (floor) query.floor = Number(floor);
    if (hasProjector !== undefined) query.hasProjector = hasProjector === 'true';

    // 2. שימוש ב-Cursor כדי לעבור חדר-חדר ולא לטעון הכל לזיכרון
    const roomCursor = Room.find(query).cursor();

    for (let room = await roomCursor.next(); room != null; room = await roomCursor.next()) {
      
      // בדיקה א: האם יש שיבוץ קבוע שתופס את השעות האלו? 
      const isPermanentOccupied = await PermanentPlacement.findOne({
        room: room._id,
        dayOfWeek,
        isActive: true,
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
      });

      // בדיקה ב: האם יש שיבוץ זמני/חד-פעמי שתופס את החדר? 
      const isTemporaryOccupied = await TemporaryPlacement.findOne({
        room: room._id,
        date: searchDate,
        type: 'placement',
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
      });

      // בדיקה ג: האם יש שחרור זמני לחדר הזה בתאריך הזה? 
      const isReleased = await TemporaryPlacement.findOne({
        room: room._id,
        date: searchDate,
        type: 'release',
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
      });

      // לוגיקה: אם אין שיבוץ זמני, וגם (אין שיבוץ קבוע או שיש שחרור זמני) -> החדר פנוי!
      if (!isTemporaryOccupied && (!isPermanentOccupied || isReleased)) {
        console.log(`Found a room! Stopping search at room: ${room._id}`);
        return res.json(room); // ברגע שמצאנו חדר, אנחנו מחזירים אותו ועוצרים את כל הפונקציה
      }
    }

    // אם עברנו על כל החדרים ולא מצאנו כלום
    res.status(404).json({ message: "No available rooms found for the requested time" });

  } catch (error) {
    res.status(500).json({ message: "Error in fast search", error: error.message });
  }
};
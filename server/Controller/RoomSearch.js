import Room from '../models/Room.js';
import PermanentPlacement from '../models/PermanentPlacement.js';
import TemporaryPlacement from '../models/TemporaryPlacement.js';

export const findFirstAvailableRoom = async (req, res) => {
  try {
    const { date, startTime, endTime, minSize, wing, floor, hasProjector } = req.query;

    const searchDate = new Date(date);
    const dayOfWeek = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'][searchDate.getDay()];

    let query = {};
    if (minSize) query.size = { $gte: Number(minSize) };
    if (wing) query.wing = wing;
    if (floor) query.floor = Number(floor);
    if (hasProjector !== undefined) query.hasProjector = hasProjector === 'true';

    const roomCursor = Room.find(query).cursor();

    for (let room = await roomCursor.next(); room != null; room = await roomCursor.next()) {

      const isPermanentOccupied = await PermanentPlacement.findOne({
        room: room._id,
        dayOfWeek,
        isActive: true,
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
      });

      const isTemporaryOccupied = await TemporaryPlacement.findOne({
        room: room._id,
        date: searchDate,
        type: 'placement',
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
      });

      const isReleased = await TemporaryPlacement.findOne({
        room: room._id,
        date: searchDate,
        type: 'release',
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
      });

      if (!isTemporaryOccupied && (!isPermanentOccupied || isReleased)) {
        console.log(`Found a room! Stopping search at room: ${room._id}`);
        return res.json(room);
      }
    }

    res.status(404).json({ message: "No available rooms found for the requested time" });

//   } catch (error) {
//     res.status(500).json({ message: "Error in fast search", error: error.message });
//   }
// };

// module.exports = { findFirstAvailableRoom };
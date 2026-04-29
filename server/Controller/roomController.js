import Room from '../models/Room.js';
import PermanentPlacement from '../models/PermanentPlacement.js';
import TemporaryPlacement from '../models/TemporaryPlacement.js';
import Cancellation from '../models/Cancellation.js';


/**
 * פונקציה לחיפוש החדר הפנוי הראשון בהתבסס על אילוצים וביטולים
 */
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

            const isCancelled = await Cancellation.findOne({
                room: room._id,
                date: {
                    $gte: new Date(new Date(searchDate).setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date(searchDate).setHours(23, 59, 59, 999))
                }
            });

            if (isCancelled) continue;

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
                return res.json(room);
            }
        }

        res.status(404).json({ message: "No available rooms found for the requested time" });

    } catch (error) {
        res.status(500).json({ message: "Error in fast search", error: error.message });
    }
};

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת החדרים", error: error.message });
    }
};

export const createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        const newRoom = await room.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRoom = async (req, res) => {
    try {
        const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Room not found' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const deleted = await Room.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Room not found' });
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const clearRoomPlacements = async (req, res) => {
    try {
        const { id } = req.params;
        
        // מחיקת כל השיבוצים הקבועים של החדר
        await PermanentPlacement.deleteMany({ room: id });
        
        // מחיקת כל השיבוצים הזמניים של החדר
        await TemporaryPlacement.deleteMany({ room: id });

        res.json({ message: 'כל השיבוצים של החדר נמחקו בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearAllRoomsPlacements = async (req, res) => {
    try {
        const rooms = await Room.find();
        
        for (const room of rooms) {
            await PermanentPlacement.deleteMany({ room: room._id });
            await TemporaryPlacement.deleteMany({ room: room._id });
        }

        res.json({ message: 'כל השיבוצים של כל החדרים נמחקו בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
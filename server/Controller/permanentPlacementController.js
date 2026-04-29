import PermanentPlacement from '../models/PermanentPlacement.js';

export const getAllPlacements = async (req, res) => {
  try {
    const placements = await PermanentPlacement.find().populate('room');
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPlacement = async (req, res) => {
  try {
    const placement = new PermanentPlacement(req.body);
    const newPlacement = await placement.save();
    res.status(201).json(newPlacement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePlacement = async (req, res) => {
  try {
    const updated = await PermanentPlacement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Placement not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePlacement = async (req, res) => {
  try {
    const deleted = await PermanentPlacement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Placement not found' });
    res.json({ message: 'Placement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
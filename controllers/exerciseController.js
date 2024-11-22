const Exercise = require('../models/Exercise');
const { z } = require('zod');

const exerciseSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  muscleGroup: z.string().min(3),
  equipment: z.string().min(3),
});

exports.createExercise = async (req, res) => {
  try {
    const validatedData = exerciseSchema.parse(req.body);
    const exercise = new Exercise(validatedData);
    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Error creating exercise' });
    }
  }
};

exports.getAllExercises = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const exercises = await Exercise.find().skip(skip).limit(limit);
    const total = await Exercise.countDocuments();

    res.json({
      exercises,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalExercises: total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises' });
  }
};

exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercise' });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const validatedData = exerciseSchema.parse(req.body);
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, validatedData, { new: true });
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Error updating exercise' });
    }
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exercise' });
  }
};


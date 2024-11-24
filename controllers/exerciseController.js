const Exercise = require('../models/Exercise');
const { z } = require('zod');

const exerciseSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  muscleGroup: z.string().min(3),
  equipment: z.string().min(3),
  workoutType: z.string().min(3),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  youtubeLink: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  caloriesBurnedPerMinute: z.number().positive().optional(),
  instructions: z.array(z.string()).min(1),
  variations: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
});

exports.createExercise = async (req, res) => {
  try {
    const validatedData = exerciseSchema.parse(req.body);
    const exercise = new Exercise({
      ...validatedData,
      createdBy: req.user._id,
      isApproved: req.user.role === 'admin'
    });
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

    const filter = {};
    if (req.query.muscleGroup) {
      filter.muscleGroup = { $in: req.query.muscleGroup.split(',') };
    }
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    if (req.query.equipment) {
      filter.equipment = req.query.equipment;
    }

    const exercises = await Exercise.find(filter).skip(skip).limit(limit).populate('createdBy', 'username');
    const total = await Exercise.countDocuments(filter);

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
    const exercise = await Exercise.findById(req.params.id).populate('createdBy', 'username');
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
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    if (req.user.role !== 'admin' && exercise.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this exercise' });
    }

    Object.assign(exercise, validatedData);
    await exercise.save();
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
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    if (req.user.role !== 'admin' && exercise.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this exercise' });
    }

    await exercise.remove();
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exercise' });
  }
};

exports.approveExercise = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to approve exercises' });
    }

    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    exercise.isApproved = true;
    await exercise.save();
    res.json({ message: 'Exercise approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving exercise' });
  }
};
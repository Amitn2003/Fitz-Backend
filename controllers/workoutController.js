const Workout = require('../models/Workout');
const { z } = require('zod');

const workoutSchema = z.object({
  routine: z.string().optional(),
  exercises: z.array(z.object({
    exercise: z.string(),
    sets: z.array(z.object({
      weight: z.number().positive(),
      reps: z.number().int().positive(),
    })),
  })).min(1),
});

exports.logWorkout = async (req, res) => {
  try {
    const validatedData = workoutSchema.parse(req.body);
    const workout = new Workout({
      ...validatedData,
      user: req.user.userId,
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Error logging workout' });
    }
  }
};

exports.getAllWorkouts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const workouts = await Workout.find({ user: req.user.userId })
      .populate('routine')
      .populate('exercises.exercise')
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });
    const total = await Workout.countDocuments({ user: req.user.userId });

    res.json({
      workouts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalWorkouts: total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts' });
  }
};

exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user.userId })
      .populate('routine')
      .populate('exercises.exercise');
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout' });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const validatedData = workoutSchema.parse(req.body);
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      validatedData,
      { new: true }
    )
      .populate('routine')
      .populate('exercises.exercise');
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Error updating workout' });
    }
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout' });
  }
};


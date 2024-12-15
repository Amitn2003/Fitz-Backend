const Routine = require('../models/Routine');
const { z } = require('zod');

const routineSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(3),
  exercises: z.array(z.object({
    exercise: z.string(),
    sets: z.number().int().positive(),
    reps: z.number().int().positive(),
  })).min(1),
});

exports.createRoutine = async (req, res) => {
  try {
    const validatedData = routineSchema.parse(req.body);
    console.log(validatedData)
    const routine = new Routine({
      ...validatedData,
      user: req.user.userId,
    });
    console.log(routine)
    await routine.save();
    res.status(201).json(routine);
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Error creating routine' });
    }
  }
};

exports.getAllRoutines = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const routines = await Routine.find({ user: req.user.userId })
      .populate('exercises.exercise')
      .skip(skip)
      .limit(limit);
    const total = await Routine.countDocuments({ user: req.user.userId });

    res.json({
      routines,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRoutines: total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routines' });
  }
};

exports.getRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOne({ _id: req.params.id, user: req.user.userId }).populate('exercises.exercise');
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.json(routine);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routine' });
  }
};

exports.updateRoutine = async (req, res) => {
  try {
    const validatedData = routineSchema.parse(req.body);
    const routine = await Routine.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      validatedData,
      { new: true }
    ).populate('exercises.exercise');
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.json(routine);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Error updating routine' });
    }
  }
};

exports.deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.json({ message: 'Routine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting routine' });
  }
};


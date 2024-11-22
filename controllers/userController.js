const User = require('../models/User');
const { z } = require('zod');

const updateProfileSchema = z.object({
  age: z.number().int().positive().optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  weightGoal: z.number().positive().optional(),
  mainGoal: z.enum(['weight gain', 'weight loss', 'muscle gain', 'strength training', 'general fitness']).optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  preferredWorkoutSplit: z.enum(['full body', 'upper/lower', 'push/pull/legs', 'bro split', 'custom']).optional(),
});

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.user.userId, validatedData, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Error updating user profile' });
    }
  }
};


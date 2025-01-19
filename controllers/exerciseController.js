const Exercise = require('../models/Exercise');
const { z } = require('zod');

const exerciseSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  muscleGroup: z.array(z.string()),
  equipment: z.string().min(3),
  workoutType: z.string().min(3),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  weightType: z.enum(['bodyweight', 'external']),
  youtubeLink: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  caloriesBurnedPerMinute: z.number().positive().optional(),
  instructions: z.array(z.string()).min(1),
  variations: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
});

exports.createExercise = async (req, res) => {
  try {
    let validatedData = req.body;
    // Handle the caloriesBurnedPerMinute field:
    // If it's not provided or not a valid number, set it to 0
    if (validatedData.caloriesBurnedPerMinute !== undefined) {
      validatedData.caloriesBurnedPerMinute = Number(validatedData.caloriesBurnedPerMinute);
      validatedData.caloriesBurnedPerMinute = validatedData.caloriesBurnedPerMinute > 0 ? calories : 1;
      if (isNaN(validatedData.caloriesBurnedPerMinute)) {
        validatedData.caloriesBurnedPerMinute = 1;
      }
    } else {
      validatedData.caloriesBurnedPerMinute = 1;
    }
    validatedData = exerciseSchema.parse(req.body);
    console.log(validatedData)
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
      console.log(error)
      res.status(500).json({ message: 'Error creating exercise' });
    }
  }
};

// exports.getAllExercises = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const filter = {};
//     if (req.query.muscleGroup) {
//       filter.muscleGroup = { $in: req.query.muscleGroup.split(',') };
//     }
//     if (req.query.difficulty) {
//       filter.difficulty = req.query.difficulty;
//     }
//     if (req.query.equipment) {
//       filter.equipment = req.query.equipment;
//     }
//     if (req.query.weightType) {
//       filter.weightType = req.query.weightType;
//     }

//     const exercises = await Exercise.find(filter).skip(skip).limit(limit).populate('createdBy', 'username');
//     const total = await Exercise.countDocuments(filter);

//     res.json({
//       exercises,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       totalExercises: total,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching exercises' });
//   }
// };

exports.getAllExercises = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
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
    if (req.query.weightType) {
      filter.weightType = req.query.weightType;
    }

    const [exercises, total] = await Promise.all([
      Exercise.find(filter).skip(skip).limit(limit).populate('createdBy', 'username'),
      Exercise.countDocuments(filter),
    ]);

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
    console.log(req.params.id)
    // const exercise = await Exercise.findById(req.params.id).populate('createdBy', 'username');
    const exercise = await Exercise.findById(req.params.id);
    console.log(exercise , "Exr")
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercise' });
  }
};

// exports.updateExercise = async (req, res) => {
//   try {
//     const validatedData = exerciseSchema.parse(req.body);
//     const exercise = await Exercise.findById(req.params.id);
    
//     if (!exercise) {
//       return res.status(404).json({ message: 'Exercise not found' });
//     }

//     if (req.user.role !== 'admin' && exercise.createdBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to update this exercise' });
//     }

//     Object.assign(exercise, validatedData);
//     await exercise.save();
//     res.json(exercise);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       res.status(400).json({ message: error.errors });
//     } else {
//       res.status(500).json({ message: 'Error updating exercise' });
//     }
//   }
// };


exports.updateExercise = async (req, res) => {
  try {
    const validatedData = exerciseSchema.parse(req.body);
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // ✅ Only allow Admin or Creator to update
    if (req.user.role !== 'admin' && exercise.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this exercise' });
    }

    // ✅ Prevent duplicate names
    const existingExercise = await Exercise.findOne({ name: validatedData.name });
    if (existingExercise && existingExercise._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Exercise with this name already exists' });
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
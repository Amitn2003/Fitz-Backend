const Workout = require('../models/Workout');
const { z } = require('zod');
const Routine = require('../models/Routine');

const workoutSchema = z.object({
  routine: z.string(),
  duration: z.number().int().positive(),
  exercises: z.array(z.object({
    exercise: z.string(),
    sets: z.array(z.object({
      weight: z.number().nonnegative(),
      reps: z.number().int().nonnegative(),
      duration: z.number().nonnegative().optional(),
      restAfter: z.number().nonnegative().optional()
    }))
  })),
  notes: z.string().optional(),
  feelingRating: z.number().int().min(1).max(5)
});



// const mapExercisesWithRoutine = (exercises, routineExercises) => {
//   return exercises.map(exerciseData => {
//     // Log the exercise data and routine exercises for debugging
//     console.log("Exercise data:", exerciseData);
//     console.log("Routine exercises:", routineExercises);

//     // Find the corresponding routine exercise by matching the exercise ID
//     const routineExercise = routineExercises.find(routineEx => 
//       routineEx.exercise && routineEx.exercise.toString() === exerciseData.exercise
//     );
    
//     if (!routineExercise) {
//       throw new Error(`Exercise ID ${exerciseData.exercise} not found in routine`);
//     }

//     return {
//       exercise: routineExercise.exercise,  // Correct exercise reference
//       sets: exerciseData.sets
//     };
//   });
// };




const mapExercisesWithRoutine = (workoutExercises, routineExercises) => {
  return workoutExercises.map((workoutExercise, index) => {
    const routineExercise = routineExercises[index];
    console.log("Routine Exercise:", routineExercise); // Debugging log
    
    if (!routineExercise  || !routineExercise.exercise) {
      throw new Error(`No exercise found in routine at index ${index}`);
    }
    return {
      exercise: routineExercise.exercise,
      sets: workoutExercise.sets.map(set => ({
        weight: set.weight,
        reps: set.reps,
        duration: set.duration,
        restAfter: set.restAfter || routineExercise.restBetweenSets // Use routine's restBetweenSets if not provided
      }))
    };
  });
};

exports.logWorkout = async (req, res) => {
  try {
    const validatedData = workoutSchema.parse(req.body);
    
    const routine = await Routine.findById(validatedData.routine).populate('exercises.exercise');
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    console.log("Routine Exercises:", routine.exercises); // Debugging log

    const mappedExercises = mapExercisesWithRoutine(validatedData.exercises, routine.exercises);
    console.log("Mapped Exercises:", mappedExercises)

    const workout = new Workout({
      user: req.user._id,
      routine: validatedData.routine,
      duration: validatedData.duration,
      exercises: mappedExercises,
      notes: validatedData.notes,
      feelingRating: validatedData.feelingRating
    });

    console.log('Workout before save:', workout);

    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    console.error('Error in logWorkout:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: 'Validation failed', errors });
    } else {
      console.error('Error logging workout:', error);
      res.status(500).json({ message: 'Error logging workout', error: error.message });
    }
  }
};







exports.getAllWorkouts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // console.log(req.user._id)

    const workouts = await Workout.find({ user: req.user._id })
      .populate('routine')
      .populate('exercises.exercise')
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });
    const total = await Workout.countDocuments({ user: req.user.userId });
    // console.log(workouts)
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
    // console.log({ _id: req.params.id, user: req.user })
    // const workout = await Workout.findOne({ _id: req.params.id, user: req.user })
    //   .populate('routine')
    //   .populate('exercises.exercise');
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user })
  .populate('routine')
  .populate('exercises.exercise')
  .lean({ virtuals: true }); // Use lean() for faster queries

      console.log(workout)
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
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



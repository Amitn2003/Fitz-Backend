const Workout = require('../models/Workout');

exports.getWorkoutVolume = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const workouts = await Workout.find({
      user: req.user.userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('exercises.exercise');

    let totalVolume = 0;
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          totalVolume += set.weight * set.reps;
        });
      });
    });

    res.json({ totalVolume });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating workout volume' });
  }
};

exports.getMuscleGroupInsights = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const workouts = await Workout.find({
      user: req.user.userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('exercises.exercise');

    const muscleGroupCount = {};
    let totalExercises = 0;

    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const muscleGroup = exercise.exercise.muscleGroup;
        muscleGroupCount[muscleGroup] = (muscleGroupCount[muscleGroup] || 0) + 1;
        totalExercises++;
      });
    });

    const muscleGroupInsights = Object.entries(muscleGroupCount).map(([muscleGroup, count]) => ({
      muscleGroup,
      percentage: (count / totalExercises) * 100
    }));

    res.json(muscleGroupInsights);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating muscle group insights' });
  }
};

// Add more functions for consistency tracking, reps & sets trend, etc.


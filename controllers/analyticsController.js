// const Workout = require('../models/Workout.js');
// const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

// // Helper function to get date range
// const getDateRange = (range) => {
//   const now = new Date();
//   switch (range) {
//     case 'day':
//       return { start: startOfDay(now), end: endOfDay(now) };
//     case 'week':
//       return { start: startOfWeek(now), end: endOfWeek(now) };
//     case 'month':
//       return { start: startOfMonth(now), end: endOfMonth(now) };
//     default:
//       throw new Error('Invalid date range');
//   }
// };

// // Get daily workout statistics
// const getDailyStats = async (req, res) => {
//   try {
//     const { start, end } = getDateRange('day');
//     const stats = await Workout.aggregate([
//       { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
//       { $group: {
//         _id: null,
//         totalWorkouts: { $sum: 1 },
//         totalDuration: { $sum: '$duration' },
//         averageFeelingRating: { $avg: '$feelingRating' }
//       } }
//     ]);

//     res.json(stats[0] || { totalWorkouts: 0, totalDuration: 0, averageFeelingRating: 0 });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching daily stats', error: error.message });
//   }
// };

// // Get workout streak
// const getWorkoutStreak = async (req, res) => {
//   try {
//     const workouts = await Workout.find({ user: req.user._id })
//       .sort({ date: -1 })
//       .select('date');

//     let streak = 0;
//     let currentDate = new Date();

//     for (let workout of workouts) {
//       if (workout.date.toDateString() === currentDate.toDateString()) {
//         streak++;
//         currentDate.setDate(currentDate.getDate() - 1);
//       } else if (workout.date < currentDate) {
//         break;
//       }
//     }

//     res.json({ streak });
//   } catch (error) {
//     res.status(500).json({ message: 'Error calculating workout streak', error: error.message });
//   }
// };

// // Get exercise frequency
// const getExerciseFrequency = async (req, res) => {
//   try {
//     const { start, end } = getDateRange('month');
//     const frequency = await Workout.aggregate([
//       { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
//       { $unwind: '$exercises' },
//       { $group: {
//         _id: '$exercises.exercise',
//         count: { $sum: 1 }
//       } },
//       { $sort: { count: -1 } },
//       { $limit: 10 },
//       { $lookup: {
//         from: 'exercises',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'exerciseDetails'
//       } },
//       { $project: {
//         _id: 1,
//         count: 1,
//         name: { $arrayElemAt: ['$exerciseDetails.name', 0] }
//       } }
//     ]);

//     res.json(frequency);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching exercise frequency', error: error.message });
//   }
// };

// // Get progress over time
// const getProgressOverTime = async (req, res) => {
//   try {
//     const { exerciseId } = req.params;
//     const { start, end } = getDateRange('month');

//     const progress = await Workout.aggregate([
//       { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
//       { $unwind: '$exercises' },
//       { $match: { 'exercises.exercise': exerciseId } },
//       { $unwind: '$exercises.sets' },
//       { $group: {
//         _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
//         maxWeight: { $max: '$exercises.sets.weight' },
//         totalReps: { $sum: '$exercises.sets.reps' }
//       } },
//       { $sort: { _id: 1 } }
//     ]);

//     res.json(progress);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching progress over time', error: error.message });
//   }
// };



// module.exports = {
//     getDailyStats,
//     getWorkoutStreak,
//     getExerciseFrequency,
//     getProgressOverTime
//   };


// const Workout = require('../models/Workout.js');
// const mongoose = require('mongoose');
// const { 
//   startOfDay, 
//   endOfDay, 
//   startOfWeek, 
//   endOfWeek, 
//   startOfMonth, 
//   endOfMonth 
// } = require('date-fns');

// // ✅ Helper function to get date range
// const getDateRange = (range) => {
//   const now = new Date();
//   switch (range) {
//     case 'day':
//       return { start: startOfDay(now), end: endOfDay(now) };
//     case 'week':
//       return { start: startOfWeek(now), end: endOfWeek(now) };
//     case 'month':
//       return { start: startOfMonth(now), end: endOfMonth(now) };
//     default:
//       throw new Error('Invalid date range');
//   }
// };

// // ✅ Get daily workout statistics
// const getDailyStats = async (req, res) => {
//   try {
//     const { start, end } = getDateRange('day');
//     const stats = await Workout.aggregate([
//       { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
//       { $group: {
//         _id: null,
//         totalWorkouts: { $sum: 1 },
//         totalDuration: { $sum: '$duration' },
//         averageFeelingRating: { $avg: '$feelingRating' }
//       } }
//     ]);

//     res.json(stats[0] || { totalWorkouts: 0, totalDuration: 0, averageFeelingRating: 0 });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching daily stats', error: error.message });
//   }
// };

// // ✅ Get workout streak
// const getWorkoutStreak = async (req, res) => {
//   try {
//     const workouts = await Workout.find({ user: req.user._id })
//       .sort({ date: -1 })
//       .select('date');

//     let streak = 0;
//     let currentDate = startOfDay(new Date());

//     for (let workout of workouts) {
//       let workoutDate = startOfDay(workout.date);
//       if (workoutDate.getTime() === currentDate.getTime()) {
//         streak++;
//         currentDate.setDate(currentDate.getDate() - 1);
//       } else if (workoutDate < currentDate) {
//         break;
//       }
//     }

//     res.json({ streak });
//   } catch (error) {
//     res.status(500).json({ message: 'Error calculating workout streak', error: error.message });
//   }
// };

// // ✅ Get exercise frequency
// const getExerciseFrequency = async (req, res) => {
//   try {
//     const { start, end } = getDateRange('month');
//     const frequency = await Workout.aggregate([
//       { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
//       { $unwind: '$exercises' },
//       { $group: {
//         _id: '$exercises.exercise',
//         count: { $sum: 1 }
//       } },
//       { $sort: { count: -1 } },
//       { $limit: 10 },
//       { $lookup: {
//         from: 'exercises',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'exerciseDetails'
//       } },
//       { $project: {
//         _id: 1,
//         count: 1,
//         name: { $arrayElemAt: ['$exerciseDetails.name', 0] }
//       } }
//     ]);

//     res.json(frequency);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching exercise frequency', error: error.message });
//   }
// };

// // ✅ Get progress over time
// const getProgressOverTime = async (req, res) => {
//   try {
//     const { exerciseId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
//       return res.status(400).json({ message: 'Invalid exercise ID' });
//     }

//     const { start, end } = getDateRange('month');

//     const progress = await Workout.aggregate([
//       { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
//       { $unwind: '$exercises' },
//       { $match: { 'exercises.exercise': new mongoose.Types.ObjectId(exerciseId) } },
//       { $unwind: '$exercises.sets' },
//       { $group: {
//         _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
//         maxWeight: { $max: '$exercises.sets.weight' },
//         totalReps: { $sum: '$exercises.sets.reps' }
//       } },
//       { $sort: { _id: 1 } }
//     ]);

//     res.json(progress);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching progress over time', error: error.message });
//   }
// };

// module.exports = {
//   getDailyStats,
//   getWorkoutStreak,
//   getExerciseFrequency,
//   getProgressOverTime
// };



const Workout = require('../models/Workout.js');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

// Helper function to get date range
const getDateRange = (range) => {
  const now = new Date();
  switch (range) {
    case 'day':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    default:
      throw new Error('Invalid date range');
  }
};

// Get daily workout statistics
const getDailyStats = async (req, res) => {
  try {
    const { start, end } = getDateRange('day');
    console.log(start, end)
    const stats = await Workout.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
      { $group: {
        _id: '$user',
        totalWorkouts: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        averageFeelingRating: { $avg: '$feelingRating' }
      } }
    ]);
    console.log(stats, "Stats")
    // res.json(stats.length > 0 ? stats[0] : { totalWorkouts: 0, totalDuration: 0, averageFeelingRating: 0 });

    res.json(stats[0] || { totalWorkouts: 0, totalDuration: 0, averageFeelingRating: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily stats', error: error.message });
  }
};

// Get workout streak
// const getWorkoutStreak = async (req, res) => {
//   try {
//     const workouts = await Workout.find({ user: req.user._id })
//       .sort({ date: -1 })
//       .select('date');

//     let streak = 0;
//     let currentDate = new Date();

//     for (let workout of workouts) {
//       if (workout.date.toDateString() === currentDate.toDateString()) {
//         streak++;
//         currentDate.setDate(currentDate.getDate() - 1);
//       } else if (workout.date < currentDate) {
//         break;
//       }
//     }

//     res.json({ streak });
//   } catch (error) {
//     res.status(500).json({ message: 'Error calculating workout streak', error: error.message });
//   }
// };



const getWorkoutStreak = async (req, res) => {
  console.log("Hello")
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .select('date');

    let streak = 0;
    let currentDate = startOfDay(new Date());

    for (let workout of workouts) {
      let workoutDate = startOfDay(workout.date);
      // If the workout is on the same day as the current date, increase streak
      if (workoutDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (workoutDate < currentDate) {
        // Stop streak when workout is older than the current date
        break;
      }
    }

    res.json({ streak });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating workout streak', error: error.message });
  }
};










// Get exercise frequency
const getExerciseFrequency = async (req, res) => {
  console.log("Hello from exercise freq")
  try {
    const { start, end } = getDateRange('month');
    const frequency = await Workout.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
      { $unwind: '$exercises' },
      { $group: {
        _id: '$exercises.exercise',
        count: { $sum: 1 }
      } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'exercises',
        localField: '_id',
        foreignField: '_id',
        as: 'exerciseDetails'
      } },
      { $project: {
        _id: 1,
        count: 1,
        name: { $arrayElemAt: ['$exerciseDetails.name', 0] }
      } }
    ]);

    res.json(frequency);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercise frequency', error: error.message });
  }
};

// Get progress over time
const getProgressOverTime = async (req, res) => {
  console.log("Hello from progress over time")
  try {
    const { exerciseId } = req.params;
    const { start, end } = getDateRange('month');

    const progress = await Workout.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
      { $unwind: '$exercises' },
      { $match: { 'exercises.exercise': exerciseId } },
      { $unwind: '$exercises.sets' },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        maxWeight: { $max: '$exercises.sets.weight' },
        totalReps: { $sum: '$exercises.sets.reps' }
      } },
      { $sort: { _id: 1 } }
    ]);

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress over time', error: error.message });
  }
};


module.exports = {
  getDailyStats,
  getWorkoutStreak,
  getExerciseFrequency,
  getProgressOverTime
};
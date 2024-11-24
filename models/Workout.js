const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine' },
  date: { type: Date, default: Date.now },
  duration: { type: Number, required: true }, // in minutes
  exercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    sets: [{
      weight: { type: Number, required: true },
      reps: { type: Number, required: true },
      duration: { type: Number }, // in seconds, for timed exercises
      restAfter: { type: Number, required: true } // in seconds
    }],
  }],
  notes: { type: String },
  feelingRating: { type: Number, min: 1, max: 5 },
  caloriesBurned: { type: Number },
  location: { type: String },
  weather: { type: String },
  photoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);


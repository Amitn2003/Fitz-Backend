const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine' },
  date: { type: Date, default: Date.now },
  exercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    sets: [{
      weight: { type: Number, required: true },
      reps: { type: Number, required: true },
    }],
  }],
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);


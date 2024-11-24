const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  exercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    duration: { type: Number }, // in seconds, for timed exercises
    restBetweenSets: { type: Number, required: true } // in seconds
   }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  estimatedDuration: { type: Number }, // in minutes
  targetMuscleGroups: { type: [String]},
  workoutType: { type: String },
  equipment: { type: [String], required: true },
  tags: { type: [String] },
  isPublic: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  timesUsed: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Routine', routineSchema);


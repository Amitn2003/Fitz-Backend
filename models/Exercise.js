const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },  
  muscleGroup: { type: [String], required: true },
  equipment: { type: String, required: true },
  workoutType: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  weightType: { type: String, required: true, enum: ['bodyweight', 'external'] },
  youtubeLink: { type: String, default: 'none' },
  imageUrl: { type: String },
  caloriesBurnedPerMinute: { type: Number },
  instructions: { type: [String]},
  variations: { type: [String] },
  tips: { type: [String] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);


const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  equipment: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);


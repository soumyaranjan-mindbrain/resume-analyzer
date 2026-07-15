const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, default: "Full-time" },
  experience: { type: String, default: null },
  requirements: { type: String, default: null },
  responsibilities: { type: String, default: null },
  skillsRequired: { type: [String], default: [] },
  salary: { type: String, default: null },
  isHired: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jdSource: { type: String, default: "MANUAL" },
  jdText: { type: String, default: null },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: "jobs"
});

module.exports = mongoose.model("Job", jobSchema);

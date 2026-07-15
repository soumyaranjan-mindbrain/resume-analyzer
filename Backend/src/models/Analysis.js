const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true, unique: true },
  atsScore: { type: Number, required: true },
  scoreBreakdown: { type: mongoose.Schema.Types.Mixed, default: null },
  keywordsMissing: { type: mongoose.Schema.Types.Mixed, required: true },
  jobsMatched: { type: Number, required: true },
  suggestions: { type: mongoose.Schema.Types.Mixed, required: true },
  trends: { type: mongoose.Schema.Types.Mixed, required: true },
  summary: { type: String, default: null },
  experienceLevel: { type: String, default: null },
  topStrengths: { type: mongoose.Schema.Types.Mixed, default: null },
  weaknesses: { type: mongoose.Schema.Types.Mixed, default: null },
  roadmap: { type: mongoose.Schema.Types.Mixed, default: null },
  completedPhases: { type: [Number], default: [] },
}, {
  timestamps: true,
  collection: "analysis"
});

module.exports = mongoose.model("Analysis", analysisSchema);

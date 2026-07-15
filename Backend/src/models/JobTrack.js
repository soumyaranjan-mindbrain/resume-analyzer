const mongoose = require("mongoose");

const jobTrackSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  skills: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: false, updatedAt: true },
  collection: "job_tracks"
});

module.exports = mongoose.model("JobTrack", jobTrackSchema);

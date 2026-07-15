const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  extractedText: { type: String, default: "" },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: "resumes"
});

module.exports = mongoose.model("Resume", resumeSchema);

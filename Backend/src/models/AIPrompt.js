const mongoose = require("mongoose");

const aiPromptSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: false, updatedAt: true },
  collection: "ai_prompts"
});

module.exports = mongoose.model("AIPrompt", aiPromptSchema);

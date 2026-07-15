const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: "GENERAL" },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: "faqs"
});

module.exports = mongoose.model("Faq", faqSchema);

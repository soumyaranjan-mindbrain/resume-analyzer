const mongoose = require("mongoose");

const helpTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "OPEN" },
  reply: { type: String, default: null },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: "help_tickets"
});

module.exports = mongoose.model("HelpTicket", helpTicketSchema);

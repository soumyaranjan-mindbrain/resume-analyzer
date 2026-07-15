const mongoose = require("mongoose");

const systemConfigSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: false, updatedAt: true },
  collection: "system_configs"
});

module.exports = mongoose.model("SystemConfig", systemConfigSchema);

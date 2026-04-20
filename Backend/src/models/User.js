const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "student"],
    default: "student"
  },
  phone: { type: String, default: "", unique: true },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  course: { type: String, default: "" },
  status: { type: String, default: "Active" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  refreshToken: { type: String, default: "" },
}, {
  timestamps: true,
  collection: "users" // Explicitly map to match Prisma's @@map("users")
});

module.exports = mongoose.model("User", userSchema);
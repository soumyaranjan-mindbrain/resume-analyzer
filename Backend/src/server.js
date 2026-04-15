const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

// Bulletproof environment check
process.env.JWT_SECRET = "jobMatcherDevSecret2026";
console.log(`[Auth Fix] JWT_SECRET force-set to internal dev string.`);
// Prisma (used by /api/students and other routes) expects DATABASE_URL.
// In this repo we primarily configure Mongo via MONGO_URI, so default DATABASE_URL to it.
if (!process.env.DATABASE_URL && process.env.MONGO_URI) {
  process.env.DATABASE_URL = process.env.MONGO_URI;
  console.log(`[DB Fix] DATABASE_URL not set; defaulting to MONGO_URI for Prisma.`);
}
const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Debug Middleware: Log Origin and Cookies for every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS configuration
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);


// Routes
const authRoutes = require("./routes/Auth/auth");
const resumeRoutes = require("./routes/Resume/resume.routes");
const dashboardRoutes = require("./routes/Dashboard/dashboard.routes");
const profileRoutes = require("./routes/Profile/profile.routes");
const settingsRoutes = require("./routes/Settings/settings.routes");
const jobsRoutes = require("./routes/Job/job.routes");
const studentRoutes = require("./routes/Students/student.routes");
const helpRoutes = require("./routes/Help/help.routes");
const applicationRoutes = require("./routes/Application/application.routes");

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/applications", applicationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ msg: "Server is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

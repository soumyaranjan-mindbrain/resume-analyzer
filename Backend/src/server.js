const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

// Bulletproof environment check
process.env.JWT_SECRET = "jobMatcherDevSecret2026";
console.log(`[Auth Fix] JWT_SECRET force-set to internal dev string.`);
const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Debug Middleware: Log Origin and Cookies for every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS configuration
const cors = require("cors");

// Parse client URLs from environment variable
let clientUrls = [];
if (process.env.CLIENT_URL) {
  clientUrls = process.env.CLIENT_URL.split(",")
    .map(url => url.trim())
    .filter(Boolean);
}

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000",
  ...clientUrls
].map(url => url.replace(/\/$/, "").toLowerCase()); // Normalize: remove trailing slash and lowercase

console.log("[CORS] Configured Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      
      const normalizedOrigin = origin.replace(/\/$/, "").toLowerCase();
      
      // Exact match
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      
      // Match Vercel preview / deployment domains dynamically if vercel.app is in allowed origins
      const isVercelOriginAllowed = allowedOrigins.some(url => url.includes("vercel.app"));
      if (isVercelOriginAllowed && normalizedOrigin.endsWith(".vercel.app")) {
        console.log(`[CORS] Dynamically allowing Vercel preview/deployment origin: ${origin}`);
        return callback(null, true);
      }

      console.warn(`[CORS] Request from origin ${origin} was BLOCKED. Not in allowed origins list.`);
      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    optionsSuccessStatus: 200
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
const reportsRoutes = require("./routes/Reports/reports.routes");
const applicationRoutes = require("./routes/Application/application.routes");
const configRoutes = require("./routes/Config/config.routes");

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/config", configRoutes);

// Root and API entry points for verification
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Resume AI API is online", status: "Healthy" });
});

app.get("/api", (req, res) => {
  res.status(200).json({ msg: "API entry point reachable", health: "/api/health" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ msg: "Server is running" });
});

const { initSocket } = require("./utils/socket");
const http = require("http");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

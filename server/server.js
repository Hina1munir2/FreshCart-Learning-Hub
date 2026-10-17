const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Trust the hosting proxy in production so rate limiting
// can identify client IP addresses correctly.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security middleware: add protective HTTP headers.
app.use(helmet());

// Parse incoming JSON requests.
app.use(express.json({ limit: "10kb" }));

// Allow local development and the deployed frontend.
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as
      // local scripts and server-to-server requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// General API rate limit: 100 requests per 15 minutes per IP.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

// Stricter rate limit for login and registration.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

// Apply general rate limiting to API endpoints.
app.use("/api", apiLimiter);

// Test route.
app.get("/", (req, res) => {
  res.send("FreshCart Learning Hub API is running!");
});

// Course routes.
app.use("/api/courses", courseRoutes);

// Authentication routes get an additional rate limit.
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/enrollments", enrollmentRoutes);

app.get("/api/enrollments-test", (req, res) => {
  res.json({ message: "Enrollment API route is reachable" });
});

app.use("/api/progress", progressRoutes);

// Export the app so Jest and Supertest can test it
// without opening a real HTTP listening port.
module.exports = app;

// Connect to MongoDB and start the server when run directly.
if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");

      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      process.exitCode = 1;
    });
}
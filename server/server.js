const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");

const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Course routes
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.get("/api/enrollments-test", (req, res) => {
  res.json({ message: "Enrollment API route is reachable" });
});
app.use("/api/progress", progressRoutes);


// MongoDB connection
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
  });

// Test route
app.get("/", (req, res) => {
  res.send("FreshCart Learning Hub API is running!");
});
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
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
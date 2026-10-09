
const express = require("express");
const Enrollment = require("../models/Enrollment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET progress for the logged-in user
// GET /api/progress
router.get("/", authMiddleware, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id,
    }).populate("course", "title description");

    return res.status(200).json({
      message: "Progress retrieved successfully",
      progress: enrollments.map((enrollment) => ({
        enrollmentId: enrollment._id,
        course: enrollment.course,
        progress: enrollment.progress,
        status: enrollment.status,
      })),
    });
  } catch (error) {
    console.error("Progress error:", error);

    return res.status(500).json({
      message: "Failed to retrieve progress",
    });
  }
});

module.exports = router;
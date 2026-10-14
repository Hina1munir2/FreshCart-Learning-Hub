
const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL ENROLLMENTS FOR THE LOGGED-IN USER
// GET /api/enrollments
// Requires a valid JWT token
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id,
    })
      .populate("course")
      .sort({ createdAt: -1 });

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error("Load enrollments error:", error);

    return res.status(500).json({
      message: "Failed to load enrollments",
    });
  }
});

// ==========================================
// ENROLL IN A COURSE
// POST /api/enrollments
// Requires a valid JWT token
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
    });

    return res.status(201).json({
      message: "Successfully enrolled in course",
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "You are already enrolled in this course",
      });
    }

    return res.status(500).json({
      message: "Failed to enroll in course",
    });
  }
});

module.exports = router;

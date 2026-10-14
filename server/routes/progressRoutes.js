
const express = require("express");
const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET progress for the logged-in user
// GET /api/progress
router.get("/", authMiddleware, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id,
    }).populate("course", "title description lessons");

    const progress = enrollments
      .filter((enrollment) => enrollment.course)
      .map((enrollment) => ({
        enrollmentId: enrollment._id,
        course: enrollment.course,
        completedLessons: enrollment.completedLessons || [],
        totalLessons: enrollment.course.lessons.length,
        progress: enrollment.progress,
        status: enrollment.status,
      }));

    return res.status(200).json({
      message: "Progress retrieved successfully",
      progress,
    });
  } catch (error) {
    console.error("Progress error:", error);
    return res.status(500).json({
      message: "Failed to retrieve progress",
    });
  }
});

// PATCH progress when a lesson is completed
// PATCH /api/progress/:courseId/lessons/:lessonId/complete
router.patch(
  "/:courseId/lessons/:lessonId/complete",
  authMiddleware,
  async (req, res) => {
    try {
      const { courseId, lessonId } = req.params;

      if (
        !mongoose.isValidObjectId(courseId) ||
        !mongoose.isValidObjectId(lessonId)
      ) {
        return res.status(400).json({
          message: "Invalid course or lesson ID",
        });
      }

      // Find the course and verify the lesson belongs to it.
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      const lessonExists = course.lessons.some(
        (lesson) => lesson._id.toString() === lessonId
      );

      if (!lessonExists) {
        return res.status(404).json({
          message: "Lesson not found in this course",
        });
      }

      // Only update an enrollment belonging to this logged-in user.
      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
      });

      if (!enrollment) {
        return res.status(403).json({
          message: "You must enroll in this course first",
        });
      }

      // Add the lesson only once.
      const alreadyCompleted = enrollment.completedLessons.some(
        (id) => id.toString() === lessonId
      );

      if (!alreadyCompleted) {
        enrollment.completedLessons.push(lessonId);
      }

      const totalLessons = course.lessons.length;
      const completedCount = enrollment.completedLessons.filter(
        (id) =>
          course.lessons.some(
            (lesson) => lesson._id.toString() === id.toString()
          )
      ).length;

      enrollment.progress =
        totalLessons === 0
          ? 0
          : Math.round((completedCount / totalLessons) * 100);

      enrollment.status =
        totalLessons > 0 && completedCount === totalLessons
          ? "completed"
          : "enrolled";

      await enrollment.save();

      return res.status(200).json({
        message: "Lesson marked as complete",
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        totalLessons,
        status: enrollment.status,
      });
    } catch (error) {
      console.error("Update progress error:", error);
      return res.status(500).json({
        message: "Failed to update lesson progress",
      });
    }
  }
);

module.exports = router;

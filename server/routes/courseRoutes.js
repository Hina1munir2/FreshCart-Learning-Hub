const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// ======================================================
// GET ALL COURSES - WITH PAGINATION
// GET /api/courses?page=1&limit=5
// ======================================================
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 5, 1);

    const skip = (page - 1) * limit;

    const totalCourses = await Course.countDocuments();

    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      courses,
      pagination: {
        currentPage: page,
        limit,
        totalCourses,
        totalPages: Math.ceil(totalCourses / limit),
        hasNextPage: page < Math.ceil(totalCourses / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);

    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
});

// ======================================================
// GET SINGLE COURSE
// GET /api/courses/:id
// ======================================================
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);

    res.status(500).json({
      message: "Failed to fetch course",
    });
  }
});

// ======================================================
// CREATE COURSE
// POST /api/courses
// ======================================================
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      instructor,
      duration,
      level,
      image,
      videoUrl,
      published,
    } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      instructor,
      duration,
      level,
      image,
      videoUrl,
      published,
    });

    res.status(201).json(course);
} catch (error) {
  console.error("Error creating course:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((err) => err.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid course data",
    });
  }

  return res.status(500).json({
    message: "Failed to create course",
    error: error.message,
  });
}
});

// ======================================================
// UPDATE COURSE
// PUT /api/courses/:id
// ======================================================
router.put("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json(course);
 } catch (error) {
  console.error("Error updating course:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((err) => err.message),
    });
  }

  res.status(500).json({
    message: "Failed to update course",
  });
}
});

// ======================================================
// DELETE COURSE
// DELETE /api/courses/:id
// ======================================================
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully",
      course,
    });
  } catch (error) {
    console.error("Error deleting course:", error);

    res.status(500).json({
      message: "Failed to delete course",
    });
  }
});

module.exports = router;
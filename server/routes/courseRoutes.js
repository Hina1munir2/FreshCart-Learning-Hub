const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);

    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
});

// CREATE a new course
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
      published,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);

    res.status(500).json({
      message: "Failed to create course",
    });
  }
});

module.exports = router;
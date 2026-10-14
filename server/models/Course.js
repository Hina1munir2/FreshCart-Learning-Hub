
const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },

  order: {
    type: Number,
    default: 1,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    image: {
      type: String,
      default: "",
    },

    // Keep this field for compatibility with existing courses.
    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // Individual lessons belonging to this course.
    lessons: {
      type: [lessonSchema],
      default: [],
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);

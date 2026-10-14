
const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // IDs of the lessons completed by this student.
    completedLessons: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      default: [],
    },

    // Overall course completion percentage.
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["enrolled", "completed"],
      default: "enrolled",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollment in the same course.
enrollmentSchema.index(
  { user: 1, course: 1 },
  { unique: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);

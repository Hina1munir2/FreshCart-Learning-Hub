
process.env.JWT_SECRET = "freshcart-test-secret";

jest.mock("../models/User", () => ({
  findById: jest.fn(),
}));

jest.mock("../models/Enrollment", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../models/Course", () => ({
  findById: jest.fn(),
}));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const app = require("../server");

const userId = "507f1f77bcf86cd799439011";
const courseId = "507f191e810c19729de860ea";
const lessonId = "507f191e810c19729de860eb";
const lessonId2 = "507f191e810c19729de860ec";

const token = jwt.sign(
  { userId, role: "user" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

const makeEnrollment = (overrides = {}) => ({
  _id: "enrollment123",
  user: userId,
  course: courseId,
  completedLessons: [],
  progress: 0,
  status: "enrolled",
  save: jest.fn().mockResolvedValue(true),
  ...overrides,
});

describe("Progress API", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: userId,
        name: "Test Student",
        email: "student@example.com",
        role: "user",
      }),
    });
  });

  describe("GET /api/progress", () => {
    test("rejects requests without a token", async () => {
      const response = await request(app).get("/api/progress");

      expect(response.status).toBe(401);
    });

    test("returns the logged-in user's progress", async () => {
      const enrollment = makeEnrollment({
        course: {
          _id: courseId,
          title: "Healthy Eating",
          description: "Learn healthy eating",
          lessons: [{ _id: lessonId }, { _id: lessonId2 }],
        },
      });

      Enrollment.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([enrollment]),
      });

      const response = await request(app)
        .get("/api/progress")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Progress retrieved successfully");
      expect(response.body.progress).toHaveLength(1);
      expect(response.body.progress[0].totalLessons).toBe(2);
      expect(Enrollment.find).toHaveBeenCalledWith({ user: userId });
    });

    test("omits enrollments whose course is missing", async () => {
      Enrollment.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          makeEnrollment({ course: null }),
        ]),
      });

      const response = await request(app)
        .get("/api/progress")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.progress).toEqual([]);
    });
  });

  describe("PATCH /api/progress/:courseId/lessons/:lessonId/complete", () => {
    const completionUrl = (course = courseId, lesson = lessonId) =>
      `/api/progress/${course}/lessons/${lesson}/complete`;

    test("rejects requests without a token", async () => {
      const response = await request(app).patch(completionUrl());

      expect(response.status).toBe(401);
    });

    test("rejects invalid course or lesson IDs", async () => {
      const response = await request(app).patch(
        completionUrl("bad-course-id", lessonId)
      ).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid course or lesson ID");
    });

    test("returns 404 when the course does not exist", async () => {
      Course.findById.mockResolvedValue(null);

      const response = await request(app)
        .patch(completionUrl())
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Course not found");
    });

    test("returns 404 when the lesson is not in the course", async () => {
      Course.findById.mockResolvedValue({
        _id: courseId,
        lessons: [{ _id: lessonId2, title: "Another lesson" }],
      });

      const response = await request(app)
        .patch(completionUrl())
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Lesson not found in this course");
    });

    test("requires enrollment before completing a lesson", async () => {
      Course.findById.mockResolvedValue({
        _id: courseId,
        lessons: [{ _id: lessonId, title: "Lesson one" }],
      });

      Enrollment.findOne.mockResolvedValue(null);

      const response = await request(app)
        .patch(completionUrl())
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You must enroll in this course first"
      );
    });

    test("marks a lesson complete and calculates progress", async () => {
      Course.findById.mockResolvedValue({
        _id: courseId,
        lessons: [
          { _id: lessonId, title: "Lesson one" },
          { _id: lessonId2, title: "Lesson two" },
        ],
      });

      const enrollment = makeEnrollment();
      Enrollment.findOne.mockResolvedValue(enrollment);

      const response = await request(app)
        .patch(completionUrl())
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Lesson marked as complete");
      expect(response.body.progress).toBe(50);
      expect(response.body.totalLessons).toBe(2);
      expect(response.body.status).toBe("enrolled");
      expect(enrollment.save).toHaveBeenCalled();
    });

    test("marks the course completed when all lessons are complete", async () => {
      Course.findById.mockResolvedValue({
        _id: courseId,
        lessons: [
          { _id: lessonId, title: "Lesson one" },
          { _id: lessonId2, title: "Lesson two" },
        ],
      });

      const enrollment = makeEnrollment({
        completedLessons: [lessonId],
      });
      Enrollment.findOne.mockResolvedValue(enrollment);

      const response = await request(app)
        .patch(completionUrl(courseId, lessonId2))
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.progress).toBe(100);
      expect(response.body.status).toBe("completed");
      expect(enrollment.save).toHaveBeenCalled();
    });

    test("does not add a lesson a second time", async () => {
      Course.findById.mockResolvedValue({
        _id: courseId,
        lessons: [{ _id: lessonId, title: "Lesson one" }],
      });

      const enrollment = makeEnrollment({
        completedLessons: [lessonId],
      });
      Enrollment.findOne.mockResolvedValue(enrollment);

      const response = await request(app)
        .patch(completionUrl())
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.completedLessons).toHaveLength(1);
      expect(response.body.progress).toBe(100);
      expect(response.body.status).toBe("completed");
    });
  });
});

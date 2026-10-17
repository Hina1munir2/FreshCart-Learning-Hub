
process.env.JWT_SECRET = "freshcart-test-secret";

jest.mock("../models/User", () => ({
  findById: jest.fn(),
}));

jest.mock("../models/Enrollment", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
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

const testUser = {
  _id: "user123",
  name: "Test Student",
  email: "student@example.com",
  role: "user",
};

const token = jwt.sign(
  { userId: testUser._id, role: testUser.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

describe("Enrollments API", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // The real authentication middleware calls findById().select().
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(testUser),
    });
  });

  describe("GET /api/enrollments", () => {
    test("rejects requests without a token", async () => {
      const response = await request(app).get("/api/enrollments");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Access denied. Please provide a valid token."
      );
    });

    test("returns enrollments for the logged-in user", async () => {
      const enrollments = [
        {
          _id: "enrollment123",
          user: testUser._id,
          course: {
            _id: "course123",
            title: "Healthy Eating",
          },
          progress: 0,
        },
      ];

      Enrollment.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(enrollments),
        }),
      });

      const response = await request(app)
        .get("/api/enrollments")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].course.title).toBe("Healthy Eating");
      expect(Enrollment.find).toHaveBeenCalledWith({
        user: testUser._id,
      });
    });
  });

  describe("POST /api/enrollments", () => {
    test("rejects requests without a token", async () => {
      const response = await request(app)
        .post("/api/enrollments")
        .send({ courseId: "course123" });

      expect(response.status).toBe(401);
    });

    test("rejects requests without a course ID", async () => {
      const response = await request(app)
        .post("/api/enrollments")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Course ID is required");
    });

    test("returns 404 when the course does not exist", async () => {
      Course.findById.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/enrollments")
        .set("Authorization", `Bearer ${token}`)
        .send({ courseId: "course123" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Course not found");
    });

    test("rejects duplicate enrollments", async () => {
      Course.findById.mockResolvedValue({
        _id: "course123",
        title: "Healthy Eating",
      });

      Enrollment.findOne.mockResolvedValue({
        _id: "enrollment123",
        user: testUser._id,
        course: "course123",
      });

      const response = await request(app)
        .post("/api/enrollments")
        .set("Authorization", `Bearer ${token}`)
        .send({ courseId: "course123" });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "You are already enrolled in this course"
      );
      expect(Enrollment.create).not.toHaveBeenCalled();
    });

    test("enrolls a user successfully", async () => {
      Course.findById.mockResolvedValue({
        _id: "course123",
        title: "Healthy Eating",
      });

      Enrollment.findOne.mockResolvedValue(null);

      Enrollment.create.mockResolvedValue({
        _id: "enrollment123",
        user: testUser._id,
        course: "course123",
        progress: 0,
        status: "enrolled",
      });

      const response = await request(app)
        .post("/api/enrollments")
        .set("Authorization", `Bearer ${token}`)
        .send({ courseId: "course123" });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe(
        "Successfully enrolled in course"
      );
      expect(response.body.enrollment.course).toBe("course123");

      expect(Enrollment.create).toHaveBeenCalledWith({
        user: testUser._id,
        course: "course123",
      });
    });
  });
});

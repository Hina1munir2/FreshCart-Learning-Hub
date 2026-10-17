
jest.mock("../models/Course", () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const request = require("supertest");
const Course = require("../models/Course");
const app = require("../server");

describe("Courses API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================================================
  // GET ALL COURSES
  // ======================================================

  describe("GET /api/courses", () => {
    test("returns courses with pagination information", async () => {
      const courses = [
        {
          _id: "course123",
          title: "Healthy Eating",
          category: "Nutrition",
          published: true,
        },
      ];

      Course.countDocuments.mockResolvedValue(1);

      Course.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(courses),
      });

      const response = await request(app).get("/api/courses");

      expect(response.status).toBe(200);
      expect(response.body.courses).toHaveLength(1);
      expect(response.body.courses[0].title).toBe("Healthy Eating");
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalCourses).toBe(1);
      expect(response.body.pagination.totalPages).toBe(1);
      expect(response.body.pagination.hasNextPage).toBe(false);
      expect(response.body.pagination.hasPreviousPage).toBe(false);
    });

    test("applies search, category, and pagination filters", async () => {
      Course.countDocuments.mockResolvedValue(0);

      Course.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });

      const response = await request(app).get(
        "/api/courses?page=2&limit=3&search=healthy&category=Nutrition"
      );

      expect(response.status).toBe(200);
      expect(response.body.courses).toEqual([]);
      expect(response.body.pagination.currentPage).toBe(2);
      expect(response.body.pagination.limit).toBe(3);

      expect(Course.countDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          published: true,
          category: {
            $regex: "^Nutrition$",
            $options: "i",
          },
          title: {
            $regex: "healthy",
            $options: "i",
          },
        })
      );
    });

    test("returns 500 when listing courses fails", async () => {
      Course.countDocuments.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get("/api/courses");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to fetch courses");
    });

    test("handles special characters in search safely", async () => {
      Course.countDocuments.mockResolvedValue(0);

      Course.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });

      const response = await request(app).get(
        "/api/courses?search=food%2Bhealth"
      );

      expect(response.status).toBe(200);

      expect(Course.countDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          title: {
            $regex: "food\\+health",
            $options: "i",
          },
        })
      );
    });

    test("supports the all category filter", async () => {
      Course.countDocuments.mockResolvedValue(0);

      Course.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });

      const response = await request(app).get(
        "/api/courses?category=all"
      );

      expect(response.status).toBe(200);

      expect(Course.countDocuments).toHaveBeenCalledWith({
        published: true,
      });
    });
  });

  // ======================================================
  // GET SINGLE COURSE
  // ======================================================

  describe("GET /api/courses/:id", () => {
    test("returns a course when it exists", async () => {
      Course.findById.mockResolvedValue({
        _id: "course123",
        title: "Healthy Eating",
        description: "Learn about healthy food.",
      });

      const response = await request(app).get("/api/courses/course123");

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Healthy Eating");
    });

    test("returns 404 when the course does not exist", async () => {
      Course.findById.mockResolvedValue(null);

      const response = await request(app).get("/api/courses/course123");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Course not found");
    });

    test("returns 500 when fetching a course fails", async () => {
      Course.findById.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/courses/course123");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to fetch course");
    });
  });

  // ======================================================
  // POST - CREATE COURSE
  // ======================================================

  describe("POST /api/courses", () => {
    const courseData = {
      title: "Healthy Eating",
      description: "Learn about healthy food.",
      category: "Nutrition",
      instructor: "FreshCart Team",
      duration: "4 weeks",
      level: "Beginner",
    };

    test("creates a course successfully", async () => {
      Course.create.mockResolvedValue({
        _id: "course123",
        ...courseData,
        lessons: [],
      });

      const response = await request(app)
        .post("/api/courses")
        .send(courseData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("Healthy Eating");

      expect(Course.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...courseData,
          lessons: [],
        })
      );
    });

    test("returns 400 when course creation fails validation", async () => {
      const validationError = new Error("Validation failed");
      validationError.name = "ValidationError";
      validationError.errors = {
        title: {
          message: "Title is required",
        },
      };

      Course.create.mockRejectedValue(validationError);

      const response = await request(app)
        .post("/api/courses")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toContain("Title is required");
    });

    test("returns 400 when course creation has invalid data", async () => {
      const castError = new Error("Invalid data");
      castError.name = "CastError";

      Course.create.mockRejectedValue(castError);

      const response = await request(app)
        .post("/api/courses")
        .send(courseData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid course data");
    });

    test("returns 500 when course creation fails unexpectedly", async () => {
      Course.create.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/api/courses")
        .send(courseData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to create course");
    });
  });

  // ======================================================
  // PUT - UPDATE COURSE
  // ======================================================

  describe("PUT /api/courses/:id", () => {
    test("updates a course successfully", async () => {
      Course.findByIdAndUpdate.mockResolvedValue({
        _id: "course123",
        title: "Updated Healthy Eating",
        description: "Learn about healthy food.",
        category: "Nutrition",
      });

      const response = await request(app)
        .put("/api/courses/course123")
        .send({
          title: "Updated Healthy Eating",
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Healthy Eating");

      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        "course123",
        {
          title: "Updated Healthy Eating",
        },
        {
          new: true,
          runValidators: true,
        }
      );
    });

    test("returns 404 when updating a missing course", async () => {
      Course.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/courses/course123")
        .send({
          title: "Updated Healthy Eating",
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Course not found");
    });

    test("returns 400 when an update fails validation", async () => {
      const validationError = new Error("Validation failed");
      validationError.name = "ValidationError";
      validationError.errors = {
        title: {
          message: "Title is required",
        },
      };

      Course.findByIdAndUpdate.mockRejectedValue(validationError);

      const response = await request(app)
        .put("/api/courses/course123")
        .send({
          title: "",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toContain("Title is required");
    });

    test("returns 500 when updating a course fails unexpectedly", async () => {
      Course.findByIdAndUpdate.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .put("/api/courses/course123")
        .send({
          title: "Updated Healthy Eating",
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to update course");
    });
  });

  // ======================================================
  // DELETE - DELETE COURSE
  // ======================================================

  describe("DELETE /api/courses/:id", () => {
    test("deletes a course successfully", async () => {
      Course.findByIdAndDelete.mockResolvedValue({
        _id: "course123",
        title: "Healthy Eating",
        category: "Nutrition",
      });

      const response = await request(app).delete(
        "/api/courses/course123"
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Course deleted successfully");
      expect(response.body.course._id).toBe("course123");
    });

    test("returns 404 when deleting a missing course", async () => {
      Course.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete(
        "/api/courses/course123"
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Course not found");
    });

    test("returns 500 when deleting a course fails", async () => {
      Course.findByIdAndDelete.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).delete(
        "/api/courses/course123"
      );

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to delete course");
    });
  });
});

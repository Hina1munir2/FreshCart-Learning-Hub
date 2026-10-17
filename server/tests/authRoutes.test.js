
process.env.JWT_SECRET = "freshcart-test-secret";

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const request = require("supertest");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const app = require("../server");

describe("Authentication API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    test("rejects registration when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ email: "student@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Name, email, and password are required"
      );
    });

    test("rejects passwords shorter than six characters", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Student",
          email: "student@example.com",
          password: "123",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Password must be at least 6 characters long"
      );
    });

    test("rejects an email that is already registered", async () => {
      User.findOne.mockResolvedValue({
        email: "student@example.com",
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Student",
          email: "student@example.com",
          password: "secret123",
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "An account with this email already exists"
      );
    });

    test("registers a new user successfully", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-password");

      User.create.mockResolvedValue({
        _id: "user123",
        name: "Student",
        email: "student@example.com",
        role: "user",
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Student",
          email: " STUDENT@EXAMPLE.COM ",
          password: "secret123",
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user.email).toBe("student@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("secret123", 10);
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Student",
          email: "student@example.com",
          password: "hashed-password",
        })
      );
    });
  });

  describe("POST /api/auth/login", () => {
    test("rejects login when email or password is missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "student@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Email and password are required"
      );
    });

    test("rejects login when the user does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "unknown@example.com",
          password: "secret123",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });

    test("logs in a valid user and returns a JWT", async () => {
      User.findOne.mockResolvedValue({
        _id: "user123",
        email: "student@example.com",
        password: "hashed-password",
        role: "user",
      });

      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "student@example.com",
          password: "secret123",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBeTruthy();
      expect(response.body.user.email).toBe("student@example.com");
      expect(response.body.user).not.toHaveProperty("password");
    });
  });
});


import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CourseCatalog from "./CourseCatalog";
import api from "../api/axios";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const sampleCourses = [
  {
    _id: "course-1",
    title: "Seasonal Recipes for Healthy Eating",
    description: "Learn to prepare fresh seasonal recipes.",
    category: "Seasonal Recipes",
    instructor: "FreshCart Learning Team",
    duration: "4 weeks",
    level: "Beginner",
    image: "",
  },
  {
    _id: "course-2",
    title: "Understanding Organic Foods",
    description: "Learn about organic food choices.",
    category: "Organic Foods",
    instructor: "FreshCart Learning Team",
    duration: "3 weeks",
    level: "Beginner",
    image: "",
  },
];

function renderCatalog() {
  return render(
    <MemoryRouter initialEntries={["/courses"]}>
      <Routes>
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/login" element={<h1>Login page</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

function mockSuccessfulCourseRequests() {
  api.get.mockImplementation((url, config = {}) => {
    if (config.params?.limit === 50) {
      return Promise.resolve({
        data: { courses: sampleCourses },
      });
    }

    const search = config.params?.search?.toLowerCase() || "";

    const filteredCourses = sampleCourses.filter((course) =>
      course.title.toLowerCase().includes(search)
    );

    return Promise.resolve({
      data: {
        courses: filteredCourses,
        pagination: {
          totalCourses: filteredCourses.length,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      },
    });
  });
}

describe("CourseCatalog", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockSuccessfulCourseRequests();
  });

  test("displays courses loaded from the API", async () => {
    renderCatalog();

    expect(screen.getByText("Loading courses...")).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", {
        name: "Seasonal Recipes for Healthy Eating",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Understanding Organic Foods",
      })
    ).toBeInTheDocument();
  });

  test("requests matching courses when the user searches", async () => {
    renderCatalog();

    await screen.findByRole("heading", {
      name: "Seasonal Recipes for Healthy Eating",
    });

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: /Search courses/i,
      }),
      { target: { value: "organic" } }
    );

    expect(
      await screen.findByRole("heading", {
        name: "Understanding Organic Foods",
      })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/courses",
        expect.objectContaining({
          params: expect.objectContaining({
            search: "organic",
          }),
        })
      );
    });
  });

  test("shows an error when the course API fails", async () => {
    api.get.mockImplementation((url, config = {}) => {
      if (config.params?.limit === 50) {
        return Promise.resolve({
          data: { courses: sampleCourses },
        });
      }

      return Promise.reject({
        response: {
          data: { message: "Server unavailable" },
        },
      });
    });

    renderCatalog();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Server unavailable"
    );
  });

  test("redirects logged-out users to the login page when they enroll", async () => {
    renderCatalog();

    await screen.findByRole("heading", {
      name: "Seasonal Recipes for Healthy Eating",
    });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Enroll Now/i })[0]
    );

    expect(
      await screen.findByRole("heading", { name: "Login page" })
    ).toBeInTheDocument();

    expect(api.post).not.toHaveBeenCalled();
  });
});

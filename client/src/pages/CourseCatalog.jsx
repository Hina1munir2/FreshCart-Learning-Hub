
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import seasonalRecipesImage from "../images/seasonal-recipes.png";
import sustainableShoppingImage from "../images/sustainable-shopping.png";
import organicFoodsImage from "../images/organic-foods.png";
import "./CourseCatalog.css";

const PAGE_SIZE = 6;

function CourseCatalog() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [enrollingId, setEnrollingId] = useState("");
  const [startingCourseId, setStartingCourseId] = useState("");

  const courseImages = {
  "Seasonal Recipes for Healthy Eating": seasonalRecipesImage,
  "Sustainable Shopping Basics": sustainableShoppingImage,
  "Understanding Organic Foods": organicFoodsImage,
};
  // Load the user's existing enrollments.
  useEffect(() => {
    let cancelled = false;

    async function loadEnrollments() {
      const token = localStorage.getItem("freshcart_token");

      if (!token) {
        setEnrolledIds([]);
        return;
      }

      try {
        const response = await api.get("/enrollments");
        const data = response.data;

        const enrollments = Array.isArray(data)
          ? data
          : data?.enrollments || data?.data || [];

        const ids = enrollments
          .map((enrollment) => {
            const course = enrollment.course || enrollment.courseId;

            if (typeof course === "string") {
              return course;
            }

            return course?._id || course?.id || null;
          })
          .filter(Boolean)
          .map(String);

        if (!cancelled) {
          setEnrolledIds([...new Set(ids)]);
        }
      } catch (err) {
        console.error("Could not load enrollments:", err);
      }
    }

    loadEnrollments();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load categories for the filter dropdown.
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/courses", {
          params: { page: 1, limit: 50 },
        });

        const courseList = response.data?.courses || [];

        const uniqueCategories = [
          ...new Set(
            courseList.map((course) => course.category).filter(Boolean)
          ),
        ];

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Could not load categories:", err);
      }
    }

    loadCategories();
  }, []);

  // Fetch courses whenever search, category, or page changes.
  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/courses", {
          params: {
            page,
            limit: PAGE_SIZE,
            search,
            category,
          },
        });

        if (!cancelled) {
          setCourses(response.data?.courses || []);
          setPagination(response.data?.pagination || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load courses. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      cancelled = true;
    };
  }, [page, search, category]);

  // Enroll the current user in a course.
  async function handleEnroll(course) {
    setMessage("");
    setError("");

    const token = localStorage.getItem("freshcart_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const courseId = String(course._id);

    if (enrolledIds.includes(courseId) || enrollingId) {
      return;
    }

    setEnrollingId(courseId);

    try {
      await api.post("/enrollments", {
        courseId: course._id,
      });

      setEnrolledIds((current) =>
        current.includes(courseId) ? current : [...current, courseId]
      );

      setMessage(`You enrolled in "${course.title}" successfully.`);
    } catch (err) {
      if (err.response?.status === 409) {
        setEnrolledIds((current) =>
          current.includes(courseId) ? current : [...current, courseId]
        );

        setMessage("You are already enrolled in this course.");
      } else if (err.response?.status === 401) {
        localStorage.removeItem("freshcart_token");
        localStorage.removeItem("freshcart_user");

        setMessage("Your session has expired. Please log in again.");
        navigate("/login");
      } else {
        setMessage(
          err.response?.data?.message ||
            "Enrollment failed. Please try again."
        );
      }
    } finally {
      setEnrollingId("");
    }
  }

  // Open the first lesson using its real database ID.
  async function handleStartLearning(course) {
    setMessage("");
    setError("");

    const token = localStorage.getItem("freshcart_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const courseId = String(course._id);

    if (startingCourseId) {
      return;
    }

    setStartingCourseId(courseId);

    try {
      // The backend returns the course object directly.
      const response = await api.get(`/courses/${courseId}`);
      const courseData = response.data?.course || response.data;

      if (!courseData || !courseData._id) {
        throw new Error("The server returned invalid course data.");
      }

      const lessons = Array.isArray(courseData.lessons)
        ? [...courseData.lessons]
        : [];

      lessons.sort(
        (a, b) => (Number(a.order) || 1) - (Number(b.order) || 1)
      );

      if (lessons.length === 0) {
        setMessage(
          `No lessons are available in "${course.title}" yet.`
        );
        return;
      }

      const firstLesson = lessons.find(
        (lesson) => lesson?._id && String(lesson._id).trim()
      );

      if (!firstLesson) {
        setMessage(
          "This course's lessons do not have valid IDs. Please check the course data."
        );
        return;
      }

      navigate(
        `/courses/${courseId}/lessons/${firstLesson._id}`
      );
    } catch (err) {
      console.error(
        "Could not open course lessons:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("freshcart_token");
        localStorage.removeItem("freshcart_user");
        navigate("/login");
        return;
      }

      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Could not open this course. Please try again."
      );
    } finally {
      setStartingCourseId("");
    }
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setPage(1);
  }

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <p className="catalog-eyebrow">FRESHCART LEARNING HUB</p>

        <h1>Grow your knowledge.</h1>

        <p>
          Discover practical lessons for smarter shopping,
          healthier choices, and a more sustainable lifestyle.
        </p>
      </section>

      <section className="catalog-content">
        <div className="catalog-heading">
          <div>
            <p className="catalog-eyebrow">YOUR NEXT CHAPTER</p>
            <h2>Explore Courses</h2>
            <p>Find a course that fits your learning goals.</p>
          </div>

          <span className="course-count">
            {pagination?.totalCourses ?? 0} courses
          </span>
        </div>

        <div className="catalog-filters">
          <label className="catalog-search">
            <span>Search courses</span>
            <input
              type="search"
              placeholder="Search by course title..."
              value={search}
              onChange={handleSearchChange}
            />
          </label>

          <label className="catalog-category">
            <span>Category</span>
            <select
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="All">All categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        {message && (
          <p className="catalog-message" role="status">
            {message}
          </p>
        )}

        {loading && (
          <p className="catalog-status" role="status">
            Loading courses...
          </p>
        )}

        {!loading && error && (
          <div className="catalog-error" role="alert">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setPage((current) => current)}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="catalog-empty">
            <h3>No courses found</h3>
            <p>
              Try another search term or choose a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setPage(1);
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="course-grid">
            {courses.map((course) => {
              const courseId = String(course._id);
              const isEnrolled = enrolledIds.includes(courseId);
              const isEnrolling = enrollingId === courseId;
              const isStarting = startingCourseId === courseId;

              return (
                <article className="course-card" key={course._id}>

<div className="course-art">
  {(courseImages[course.title] || course.image) ? (
    <img
      src={courseImages[course.title] || course.image}
      alt={course.title}
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <div className="course-art-fallback">
      <span>F</span>
      <small>FRESHCART LEARNING</small>
    </div>
  )}

  <span className="course-level">
    {course.level}
  </span>
</div>


                  <div className="course-card-body">
                    <span className="course-category">
                      {course.category}
                    </span>

                    <h3>{course.title}</h3>

                    <p className="course-description">
                      {course.description}
                    </p>

                    <div className="course-meta">
                      <span>{course.instructor}</span>
                      <span>{course.duration}</span>
                    </div>

                    {!isEnrolled ? (
                      <button
                        type="button"
                        className="enroll-button"
                        onClick={() => handleEnroll(course)}
                        disabled={Boolean(enrollingId)}
                      >
                        {isEnrolling
                          ? "Enrolling..."
                          : "Enroll Now →"}
                      </button>
                    ) : (
                      <div className="course-enrolled-actions">
                        <span className="enrolled-label">
                          Enrolled ✓
                        </span>

                        <button
                          type="button"
                          className="enroll-button start-learning-button"
                          onClick={() => handleStartLearning(course)}
                          disabled={Boolean(startingCourseId)}
                        >
                          {isStarting
                            ? "Loading Lessons..."
                            : "Start Learning →"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && pagination && (
          <nav
            className="catalog-pagination"
            aria-label="Course pages"
          >
            <button
              type="button"
              onClick={() => setPage((current) => current - 1)}
              disabled={!pagination.hasPreviousPage}
            >
              ← Previous
            </button>

            <span>
              Page {pagination.currentPage} of{" "}
              {Math.max(pagination.totalPages, 1)}
            </span>

            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next →
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}

export default CourseCatalog;

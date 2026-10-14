import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import api from "./api/axios";

import heroImage from "./images/hero-freshcart.png";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseCatalog from "./pages/CourseCatalog";
import LessonViewer from "./pages/LessonViewer";
import seasonalRecipesImage from "./images/seasonal-recipes.png";
import sustainableShoppingImage from "./images/sustainable-shopping.png";
import organicFoodsImage from "./images/organic-foods.png";

import "./App.css";

/* ======================================================
   SHARED NAVBAR
====================================================== */

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";
  const isCoursesPage = location.pathname === "/courses";
  const isDashboardPage = location.pathname === "/dashboard";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  useEffect(() => {
    setMenuOpen(false);

    if (isHomePage) {
      setActiveSection("home");
    } else if (isCoursesPage) {
      setActiveSection("courses-page");
    } else if (isDashboardPage) {
      setActiveSection("dashboard");
    } else {
      setActiveSection("");
    }
  }, [location.pathname, isHomePage, isCoursesPage, isDashboardPage]);

  useEffect(() => {
    if (!isHomePage) return undefined;

    const sections = ["home", "courses", "about"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isHomePage]);

  function handleHomeSectionClick(sectionId) {
    setMenuOpen(false);

    if (!isHomePage) {
      navigate("/");
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActiveSection(sectionId);
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <Link
        to="/"
        className="logo"
        aria-label="FreshCart Learning Hub home"
        onClick={() => setActiveSection("home")}
      >
        <span className="logo-icon">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 4H5L7.4 15.2C7.6 16.2 8.5 17 9.5 17H18.5C19.5 17 20.3 16.3 20.6 15.4L22 9H6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="21" r="1.3" fill="currentColor" />
            <circle cx="18" cy="21" r="1.3" fill="currentColor" />
          </svg>
        </span>

        <span className="logo-text">
          <strong>FreshCart</strong>
          <small>LEARNING HUB</small>
        </span>
      </Link>

      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((previous) => !previous)}
      >
        {menuOpen ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        )}
      </button>

      <nav
        className={`navigation ${menuOpen ? "navigation-open" : ""}`}
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className={
            isHomePage && activeSection === "home" ? "active" : ""
          }
          aria-current={
            isHomePage && activeSection === "home" ? "page" : undefined
          }
          onClick={() => {
            setActiveSection("home");
            setMenuOpen(false);
          }}
        >
          Home
        </Link>

        <button
          type="button"
          className={
            (isHomePage && activeSection === "courses") || isCoursesPage
              ? "navigation-section-link active"
              : "navigation-section-link"
          }
          aria-current={
            isHomePage && activeSection === "courses" ? "location" : undefined
          }
          onClick={() => handleHomeSectionClick("courses")}
        >
          Courses
        </button>

        <button
          type="button"
          className={
            isHomePage && activeSection === "about"
              ? "navigation-section-link active"
              : "navigation-section-link"
          }
          aria-current={
            isHomePage && activeSection === "about" ? "location" : undefined
          }
          onClick={() => handleHomeSectionClick("about")}
        >
          About
        </button>

        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className={isDashboardPage ? "active" : ""}
            aria-current={isDashboardPage ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
        ) : (
          <>
           

           
          </>
        )}
      </nav>

      {/* RIGHT-SIDE ACTION BUTTONS */}
 <div className="navbar-actions">
  {!isAuthenticated && (
    <>
      <Link
        to="/login"
        className={`nav-auth-button ${isLoginPage ? "nav-auth-active" : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        Login
      </Link>

      <Link
        to="/register"
        className={`nav-auth-button nav-register-button ${
          isRegisterPage ? "nav-auth-active" : ""
        }`}
        onClick={() => setMenuOpen(false)}
      >
        Register
      </Link>
    </>
  )}

  {isAuthenticated && (
    <button
      type="button"
      className="nav-logout"
      onClick={handleLogout}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </svg>
      Logout
    </button>
  )}

  <Link
    to="/courses"
    className="nav-button"
    onClick={() => setMenuOpen(false)}
  >
    View Courses
    <span aria-hidden="true">→</span>
  </Link>
</div>

    </header>
  );
}

/* ======================================================
   HOMEPAGE
====================================================== */

function Home() {
  return (
    <div className="app">
      <main>
        {/* HERO */}
        <section
          className="hero"
          id="home"
          style={{
            "--hero-image": `url(${heroImage})`,
          }}
        >
          <div className="hero-overlay" />
          <div className="hero-glow" />

          <div className="hero-content">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              FreshCart Learning Hub
            </p>

            <h1>
              Learn.
              <br />
              Grow.
              <br />
              <span>Succeed.</span>
            </h1>

            <p className="hero-description">
              Build practical skills through structured learning
              experiences designed to help you grow your knowledge
              and achieve your goals.
            </p>

            <Link to="/courses" className="hero-button">
              <span>Explore All Courses</span>
              <span className="button-arrow" aria-hidden="true">
                →
              </span>
            </Link>

            <div className="hero-trust">
              <span className="trust-check">✓</span>
              Learn at your own pace
              <span className="trust-separator">•</span>
              Build practical skills
            </div>
          </div>

          <div className="hero-scroll" aria-hidden="true">
            <span className="scroll-line" />
            Discover more
          </div>
        </section>

        {/* HOMEPAGE COURSE PREVIEW */}
        <section className="home-courses" id="courses">
          <div className="section-container">
            <div className="section-heading-row">
              <div className="section-heading">
                <span className="section-kicker">
                  <span className="kicker-line" />
                  YOUR LEARNING JOURNEY
                </span>

                <h2>
                  Explore. Learn.
                  <br />
                  <span>Move Forward.</span>
                </h2>

                <p className="section-description">
                  Discover learning opportunities designed to help
                  you develop useful skills, strengthen your knowledge,
                  and take the next step toward your goals.
                </p>
              </div>

              <Link to="/courses" className="text-link">
                Browse all courses
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="course-feature-grid">
              <article className="feature-card feature-card-green">
                <div className="feature-card-top">
                  <span className="feature-number">01 / LEARN</span>
                  <span className="feature-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 13.5C13 11 19 12 24 16V38C19 34 13 33 7 35V13.5Z"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M41 13.5C35 11 29 12 24 16V38C29 34 35 33 41 35V13.5Z"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13 19L18 20M13 25L18 26M30 20L35 19M30 26L35 25"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>

                <div className="feature-card-content">
                  <span className="feature-label">BUILD KNOWLEDGE</span>
                  <h3>Learning That Fits You</h3>
                  <p>
                    Explore structured courses and learn concepts
                    step by step at a pace that works for you.
                  </p>
                </div>

                <Link to="/courses" className="feature-card-link">
                  Discover courses
                  <span aria-hidden="true">↗</span>
                </Link>
              </article>

              <article className="feature-card feature-card-cream">
                <div className="feature-card-top">
                  <span className="feature-number">02 / PRACTICE</span>
                  <span className="feature-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8"
                        y="7"
                        width="32"
                        height="34"
                        rx="6"
                        stroke="currentColor"
                        strokeWidth="2.4"
                      />
                      <path
                        d="M16 17L20 21L27 14M16 29H32M16 34H27"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <div className="feature-card-content">
                  <span className="feature-label">GAIN EXPERIENCE</span>
                  <h3>Skills With Purpose</h3>
                  <p>
                    Focus on practical learning that helps you
                    understand concepts and apply what you discover.
                  </p>
                </div>

                <Link to="/courses" className="feature-card-link">
                  Start exploring
                  <span aria-hidden="true">↗</span>
                </Link>
              </article>

              <article className="feature-card feature-card-dark">
                <div className="feature-card-top">
                  <span className="feature-number">03 / PROGRESS</span>
                  <span className="feature-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 39V27M19 39V18M30 39V23M41 39V9"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7 16L18 10L28 15L41 6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M34 6H41V13"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <div className="feature-card-content">
                  <span className="feature-label">KEEP GROWING</span>
                  <h3>Progress You Can Follow</h3>
                  <p>
                    Sign in to revisit your learning, mark completed
                    lessons, and follow your course progress.
                  </p>
                </div>

                <Link to="/dashboard" className="feature-card-link">
                  Visit your dashboard
                  <span aria-hidden="true">↗</span>
                </Link>
              </article>
            </div>

            <div className="course-bottom-banner">
              <div className="banner-mark" aria-hidden="true">
                F
              </div>

              <div className="banner-copy">
                <h3>Ready to find your next course?</h3>
                <p>
                  Browse the full course catalog and choose what
                  you would like to learn next.
                </p>
              </div>

              <Link to="/courses" className="banner-button">
                View Course Catalog
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="about">
          <div className="section-container">
            <div className="about-layout">
              <div className="about-visual">
                <div className="about-visual-main">
                  <div className="about-orbit orbit-one" />
                  <div className="about-orbit orbit-two" />

                  <span className="about-leaf leaf-one" aria-hidden="true">
                    ✳
                  </span>
                  <span className="about-leaf leaf-two" aria-hidden="true">
                    ✳
                  </span>

                  <div className="about-visual-center">
                    <span className="about-brand-mark">F</span>
                    <span className="about-brand-name">FreshCart</span>
                    <span className="about-brand-subtitle">LEARNING HUB</span>
                  </div>

                  <div className="about-floating-note note-top">
                    <span className="note-icon" aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      <strong>Learn step by step</strong>
                      <small>Make progress at your pace</small>
                    </span>
                  </div>

                  <div className="about-floating-note note-bottom">
                    <span className="note-bars" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>
                      <strong>Track your growth</strong>
                      <small>Keep your learning organized</small>
                    </span>
                  </div>
                </div>

                <span className="about-visual-caption">
                  SMALL STEPS. PRACTICAL SKILLS. CONTINUOUS GROWTH.
                </span>
              </div>

              <div className="about-content">
                <span className="section-kicker">
                  <span className="kicker-line" />
                  ABOUT FRESHCART
                </span>

                <h2>
                  A Better Way
                  <br />
                  to <span>Keep Learning.</span>
                </h2>

                <p className="about-intro">
                  FreshCart Learning Hub brings courses and learning
                  progress together in one simple place. Explore topics,
                  follow lessons, and build your knowledge one step at
                  a time.
                </p>

                <div className="about-values">
                  <div className="about-value">
                    <span className="value-check" aria-hidden="true">
                      ✓
                    </span>
                    <div>
                      <h3>Simple Learning Experience</h3>
                      <p>
                        Find courses and navigate lessons through a
                        clear, easy-to-use interface.
                      </p>
                    </div>
                  </div>

                  <div className="about-value">
                    <span className="value-check" aria-hidden="true">
                      ✓
                    </span>
                    <div>
                      <h3>Learn at Your Own Pace</h3>
                      <p>
                        Revisit available lessons and continue learning
                        whenever you are ready.
                      </p>
                    </div>
                  </div>

                  <div className="about-value">
                    <span className="value-check" aria-hidden="true">
                      ✓
                    </span>
                    <div>
                      <h3>Progress That Matters</h3>
                      <p>
                        Track completed lessons and monitor your course
                        progress from your user dashboard.
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/courses" className="about-button">
                  Start Exploring
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="about-footer-strip">
            <span>EXPLORE</span>
            <span className="strip-dot" />
            <span>LEARN</span>
            <span className="strip-dot" />
            <span>PRACTICE</span>
            <span className="strip-dot" />
            <span>GROW</span>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="home-cta">
          <div className="section-container home-cta-inner">
            <div>
              <span className="cta-kicker">
                YOUR NEXT CHAPTER STARTS HERE
              </span>
              <h2>Make time for what you want to learn.</h2>
              <p>
                Explore the catalog and take your next step with
                FreshCart Learning Hub.
              </p>
            </div>

            <Link to="/courses" className="cta-button">
              Explore Courses
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ======================================================
   FOOTER
====================================================== */

function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="footer-brand">
        <span className="footer-mark" aria-hidden="true">
          F
        </span>
        <span>
          <strong>FreshCart</strong>
          <small>LEARNING HUB</small>
        </span>
      </Link>

      <p>Learn. Grow. Succeed.</p>

      <span className="footer-copyright">
        © {new Date().getFullYear()} FreshCart Learning Hub
      </span>
    </footer>
  );
}


/* ======================================================
   USER DASHBOARD
====================================================== */

function UserDashboard() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const courseImages = {
  "Understanding Organic Foods": organicFoodsImage,
  "Sustainable Shopping Basics": sustainableShoppingImage,
  "Seasonal Recipes for Healthy Eating": seasonalRecipesImage,
};

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [enrollmentResult, progressResult] =
          await Promise.allSettled([
            api.get("/enrollments"),
            api.get("/progress"),
          ]);

        if (cancelled) return;

        if (enrollmentResult.status === "rejected") {
          throw enrollmentResult.reason;
        }

        const enrollmentData = enrollmentResult.value.data;
        const progressData =
          progressResult.status === "fulfilled"
            ? progressResult.value.data
            : {};

        const enrollments = Array.isArray(enrollmentData)
          ? enrollmentData
          : enrollmentData.enrollments ||
            enrollmentData.data ||
            [];

        const progressItems = Array.isArray(progressData)
          ? progressData
          : progressData.progress || [];

        const getId = (value) =>
          String(
            value?._id ??
              value?.id ??
              value?.course?._id ??
              value?.course?.id ??
              value?.course ??
              ""
          );

        const progressMap = new Map(
          progressItems.map((item) => [
            getId(item),
            item,
          ])
        );

        // Support enrollments containing either full course
        // objects or just course IDs.
        const courseResults = await Promise.all(
          enrollments.map(async (enrollment) => {
            const embeddedCourse =
              enrollment.course &&
              typeof enrollment.course === "object"
                ? enrollment.course
                : null;

            let course = embeddedCourse;

            if (!course) {
              const courseId = getId(enrollment);

              if (!courseId) return null;

              try {
                const response = await api.get(
                  `/courses/${courseId}`
                );

                course =
                  response.data.course || response.data;
              } catch (err) {
                console.error(
                  "Could not load enrolled course:",
                  courseId,
                  err
                );

                return null;
              }
            }

            if (!course?._id && !course?.id) {
              return null;
            }

            const courseId = String(
              course._id || course.id
            );

            const savedProgress = progressMap.get(courseId);

            const lessons = course.lessons || [];

            const completedLessons = (
              savedProgress?.completedLessons || []
            ).map((lesson) =>
              String(lesson?._id || lesson)
            );

            const completedCount = lessons.filter(
              (lesson) =>
                completedLessons.includes(String(lesson._id))
            ).length;

            const percentage = lessons.length
              ? Math.round(
                  (completedCount / lessons.length) * 100
                )
              : Number(savedProgress?.progress) || 0;

            const nextLesson = lessons.find(
              (lesson) =>
                !completedLessons.includes(
                  String(lesson._id)
                )
            );

            return {
              ...course,
              _id: courseId,
              lessons,
              completedCount,
              totalLessons: lessons.length,
              progress: Math.min(
                100,
                Math.max(0, percentage)
              ),
              nextLesson,
              completed: lessons.length > 0 &&
                completedCount === lessons.length,
              image:
                course.image ||
                course.thumbnail ||
                course.imageUrl ||
                "",
            };
          })
        );

        if (!cancelled) {
          setCourses(courseResults.filter(Boolean));

          if (progressResult.status === "rejected") {
            console.error(
              "Could not load saved progress:",
              progressResult.reason
            );
          }
        }
      } catch (err) {
        console.error("Dashboard loading failed:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Could not load your dashboard. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalCourses = courses.length;

  const completedCourses = courses.filter(
    (course) => course.completed
  ).length;

  const completedLessons = courses.reduce(
    (total, course) => total + course.completedCount,
    0
  );

  const overallProgress = totalCourses
    ? Math.round(
        courses.reduce(
          (total, course) => total + course.progress,
          0
        ) / totalCourses
      )
    : 0;

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <header className="dashboard-welcome">
          <div>
            <span className="dashboard-kicker">
              YOUR LEARNING SPACE
            </span>

            <h1>
              Welcome{user?.name ? `, ${user.name}` : ""}!
            </h1>

            <p>
              Continue learning, track your progress, and
              build new skills at your own pace.
            </p>
          </div>

          <Link
            to="/courses"
            className="dashboard-explore-btn"
          >
            + Explore Courses
          </Link>
        </header>

        {loading ? (
          <div className="dashboard-message">
            <div className="dashboard-spinner" />
            <p>Loading your learning dashboard...</p>
          </div>
        ) : error ? (
          <div className="dashboard-message dashboard-error">
            <h3>Unable to load dashboard</h3>
            <p>{error}</p>
            <button
              className="dashboard-explore-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <section className="dashboard-stats">
              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon">▣</span>
                <div>
                  <p>Enrolled Courses</p>
                  <h2>{totalCourses}</h2>
                </div>
              </article>

              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon">✓</span>
                <div>
                  <p>Completed Courses</p>
                  <h2>{completedCourses}</h2>
                </div>
              </article>

              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon">↗</span>
                <div>
                  <p>Lessons Completed</p>
                  <h2>{completedLessons}</h2>
                </div>
              </article>

              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon">%</span>
                <div>
                  <p>Overall Progress</p>
                  <h2>{overallProgress}%</h2>
                </div>
              </article>
            </section>

            <section className="dashboard-courses-section">
              <div className="dashboard-section-heading">
                <div>
                  <span className="dashboard-kicker">
                    YOUR LEARNING JOURNEY
                  </span>
                  <h2>My Courses</h2>
                </div>

                <Link
                  to="/courses"
                  className="dashboard-view-all"
                >
                  View all courses →
                </Link>
              </div>

              {courses.length === 0 ? (
                <div className="dashboard-empty">
                  <div className="dashboard-empty-icon">✦</div>
                  <h3>Start your learning journey</h3>
                  <p>
                    You haven't enrolled in any courses yet.
                    Explore our courses and choose what you
                    would like to learn.
                  </p>
                  <Link
                    to="/courses"
                    className="dashboard-explore-btn"
                  >
                    Explore Courses →
                  </Link>
                </div>
              ) : (
                <div className="dashboard-course-grid">
                  {courses.map((course) => (
                    <article
                      className="dashboard-course-card"
                      key={course._id}
                    >
                     <div className="dashboard-course-image">
  <img
    src={courseImages[course.title] || course.image}
    alt={course.title}
    onError={(event) => {
      event.currentTarget.style.display = "none";
    }}
  />

  <span className="dashboard-course-category">
    {course.category}
  </span>
</div>
                      <div className="dashboard-course-body">
                        <h3>{course.title}</h3>

                        <p className="dashboard-course-description">
                          {course.description ||
                            "Continue exploring this course and develop your skills."}
                        </p>

                        <div className="dashboard-course-progress">
                          <div>
                            <span>Your Progress</span>
                            <strong>{course.progress}%</strong>
                          </div>

                          <div className="dashboard-progress-track">
                            <div
                              className="dashboard-progress-fill"
                              style={{
                                width: `${course.progress}%`,
                              }}
                            />
                          </div>

                          <small>
                            {course.completedCount} of{" "}
                            {course.totalLessons} lessons completed
                          </small>
                        </div>

                        {course.completed ? (
                          <Link
                            to={`/courses/${course._id}`}
                            className="dashboard-continue-btn"
                          >
                            Review Course →
                          </Link>
                        ) : course.nextLesson ? (
                          <Link
                            to={`/courses/${course._id}/lessons/${course.nextLesson._id}`}
                            className="dashboard-continue-btn"
                          >
                            Continue Learning →
                          </Link>
                        ) : (
                          <Link
                            to={`/courses/${course._id}`}
                            className="dashboard-continue-btn"
                          >
                            View Course →
                          </Link>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}



function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<CourseCatalog />} />

        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={<LessonViewer />}
        />

        <Route
          path="/dashboard"
          element={<ProtectedDashboard />}
        />

        <Route
          path="*"
          element={
            <main className="simple-page">
              <div className="section-container simple-page-content">
                <h1>Page not found</h1>
                <p>The page you are looking for does not exist.</p>
                <Link to="/" className="about-button">
                  Back to Home →
                </Link>
              </div>
            </main>
          }
        />
      </Routes>
    </>
  );
}

function ProtectedDashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <UserDashboard />;
}

export default App;

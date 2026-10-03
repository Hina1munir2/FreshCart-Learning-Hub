import './App.css';
import heroImage from './images/hero-freshcart.png';
import { Routes, Route, Link } from 'react-router-dom';


function Home() {
  return (
    <div className="app">
      {/* =========================
          NAVIGATION
      ========================== */}
      <header className="navbar">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <svg
              width="21"
              height="21"
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

              <circle
                cx="10"
                cy="21"
                r="1.3"
                fill="currentColor"
              />

              <circle
                cx="18"
                cy="21"
                r="1.3"
                fill="currentColor"
              />
            </svg>
          </span>

          <span className="logo-text">
            <strong>FreshCart</strong>
            <small>LEARNING HUB</small>
          </span>
        </Link>

        <nav className="navigation">
          <Link to="/" className="active">
            Home
          </Link>

          <Link to="/courses">
            Courses
          </Link>

           <Link to="/about">
            About
          </Link>
        </nav>

        <Link to="/courses" className="nav-button">
          View Courses
        </Link>
      </header>

      {/* =========================
          HERO
      ========================== */}
      <main>
       <section
  className="hero"
  id="home"
  style={{
    '--hero-image': `url(${heroImage})`,
  }}
>

          <div className="hero-overlay"></div>

          <div className="hero-glow"></div>

          <div className="hero-content">
            <p className="eyebrow">
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
              Build practical skills through structured
              learning experiences designed to help you
              grow your knowledge and achieve your goals.
            </p>

            <Link
              to="/courses"
              className="hero-button"
            >
              <span>View Courses</span>
              <span className="button-arrow">→</span>
            </Link>
          </div>
        </section>

        {/* =========================
            COURSES PREVIEW
        ========================== */}
        <section className="section" id="courses">
          <div className="section-content">
            <p className="section-label">
              Learning
            </p>

            <h2>
              Explore Our Courses
            </h2>

            <p>
              Discover structured learning opportunities
              designed to help you develop practical skills.
            </p>

            <Link
              to="/courses"
              className="hero-button"
            >
              <span>Explore Courses</span>
              <span className="button-arrow">→</span>
            </Link>
          </div>
        </section>

        {/* =========================
            ABOUT
        ========================== */}
        <section
          className="section about-section"
          id="about"
        >
          <div className="section-content">
            <p className="section-label">
              About Us
            </p>

            <h2>
              Learning Made Simple
            </h2>

            <p>
              FreshCart Learning Hub provides a simple
              learning environment where learners can
              explore courses, build skills, and track
              their progress.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}


/* =========================
   APPLICATION ROUTES
========================= */

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
</Routes>

  );
}

export default App;
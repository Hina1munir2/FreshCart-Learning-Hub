import "./Courses.css";

function Courses() {
  return (
    <main className="courses-page">
      <section className="courses-hero">
        <p className="section-label">FreshCart Learning Hub</p>

        <h1>Explore Our Courses</h1>

        <p>
          Discover practical learning opportunities designed to help you
          develop useful skills and grow your knowledge.
        </p>

        <a href="/" className="back-home">
          ← Back to Home
        </a>
      </section>
    </main>
  );
}

export default Courses;
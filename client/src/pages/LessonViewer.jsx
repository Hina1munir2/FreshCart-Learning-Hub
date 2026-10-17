import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import "./LessonViewer.css";

const getYouTubeEmbedUrl = (url = "") => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${parsedUrl.pathname.slice(1)}`;
    }

    if (
      parsedUrl.hostname === "youtube.com" ||
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "m.youtube.com"
    ) {
      if (parsedUrl.pathname === "/watch") {
        const videoId = parsedUrl.searchParams.get("v");

        return videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : "";
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }
    }

    return "";
  } catch {
    return "";
  }
};

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();

  const [course, setCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Load course information and saved progress.
  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      setError("");
      setNotice("");

      try {
        const courseResponse = await api.get(`/courses/${courseId}`);

        const courseData =
          courseResponse.data.course || courseResponse.data;

        setCourse(courseData);

        // Load progress for the signed-in user.
        const progressResponse = await api.get("/progress");

        const enrollmentProgress = (
          progressResponse.data.progress || []
        ).find(
          (item) =>
            String(item.course?._id || item.course?.id) ===
            String(courseId)
        );

        if (enrollmentProgress) {
          setCompletedLessons(
            (enrollmentProgress.completedLessons || []).map(String)
          );

          setProgress(enrollmentProgress.progress || 0);
        } else {
          setCompletedLessons([]);
          setProgress(0);
          setError(
            "You must enroll in this course before viewing lessons."
          );
        }
      } catch (err) {
        console.error("Failed to load lesson:", err);

        setError(
          err.response?.data?.message ||
            "Could not load the course. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadLesson();
    }
  }, [courseId]);

  const lessons = course?.lessons || [];

  // Find the lesson selected in the URL.
  const currentLesson = lessons.find(
    (lesson) => String(lesson._id) === String(lessonId)
  );

  // Check whether the lesson has been completed.
  const isCompleted =
    currentLesson &&
    completedLessons.includes(String(currentLesson._id));

  // Count completed lessons belonging to this course.
  const completedLessonCount = lessons.filter((lesson) =>
    completedLessons.includes(String(lesson._id))
  ).length;

  // Save lesson completion to the backend.
  const handleComplete = async () => {
    if (!currentLesson || isCompleted || saving) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await api.patch(
        `/progress/${courseId}/lessons/${currentLesson._id}/complete`
      );

      setCompletedLessons(
        (response.data.completedLessons || []).map(String)
      );

      setProgress(response.data.progress || 0);
      setNotice("Lesson completed successfully!");
    } catch (err) {
      console.error("Failed to update progress:", err);

      setError(
        err.response?.data?.message ||
          "Could not save lesson completion. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading state.
  if (loading) {
    return (
      <div className="lesson-state">
        Loading lesson...
      </div>
    );
  }

  // Course loading error.
  if (error && !course) {
    return (
      <div className="lesson-state">
        <p>{error}</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  // Handle an invalid lesson URL.
  if (!currentLesson) {
    return (
      <div className="lesson-state">
        <p>Lesson not found.</p>
        <Link to={`/courses/${courseId}`}>
          Back to Course
        </Link>
      </div>
    );
  }

  return (
    <main className="lesson-page">
      <header className="lesson-header">
        <Link to="/dashboard" className="lesson-back">
          ← Dashboard
        </Link>

        <div>
          <p className="lesson-eyebrow">
            FRESHCART LEARNING HUB
          </p>

          <h1>{course.title}</h1>
        </div>
      </header>

      <div className="lesson-layout">
        <section className="lesson-main">
          {/* Embedded YouTube video */}
         <div className="lesson-video">
  {getYouTubeEmbedUrl(currentLesson.videoUrl) ? (
    <iframe
      key={currentLesson._id}
      src={getYouTubeEmbedUrl(currentLesson.videoUrl)}
      title={currentLesson.title || "Lesson video"}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        border: "none",
      }}
    />
  ) : (
    <p>
      No valid YouTube video URL is available for this lesson.
    </p>
  )}
</div>

          <div className="lesson-details">
            <p className="lesson-eyebrow">
              CURRENT LESSON
            </p>

            <h2>{currentLesson.title}</h2>

            <p>{course.description}</p>

            {error && (
              <p className="lesson-error" role="alert">
                {error}
              </p>
            )}

            {notice && (
              <p className="lesson-success" role="status">
                {notice}
              </p>
            )}

            <button
              type="button"
              className="complete-lesson-btn"
              onClick={handleComplete}
              disabled={Boolean(isCompleted) || saving}
            >
              {isCompleted
                ? "✓ Lesson Completed"
                : saving
                  ? "Saving Progress..."
                  : "Mark as Complete"}
            </button>
          </div>
        </section>

        <aside className="lesson-sidebar">
          <h3>Course Content</h3>

          <div className="lesson-progress-heading">
            <span>Your Progress</span>
            <strong>{progress}%</strong>
          </div>

          <div
            className="lesson-progress-track"
            role="progressbar"
            aria-label="Course progress"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="lesson-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="lesson-count">
            {completedLessonCount} of {lessons.length} lessons completed
          </p>

          <div className="lesson-list">
            {lessons
              .slice()
              .sort(
                (a, b) => (a.order || 0) - (b.order || 0)
              )
              .map((lesson, index) => {
                const completed = completedLessons.includes(
                  String(lesson._id)
                );

                const active =
                  String(lesson._id) === String(lessonId);

                return (
                  <Link
                    key={lesson._id}
                    to={`/courses/${courseId}/lessons/${lesson._id}`}
                    className={`lesson-list-item ${
                      active ? "active" : ""
                    }`}
                  >
                    <span className="lesson-number">
                      {completed ? "✓" : index + 1}
                    </span>

                    <span>{lesson.title}</span>
                  </Link>
                );
              })}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default LessonViewer;

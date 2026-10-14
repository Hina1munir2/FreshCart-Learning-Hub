
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Register.css";
import registerImage from "../images/auth-bg.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccess("Your account has been created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderEyeIcon = (visible) => (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.3 1.1-1.1 2.4-2.3 3.5" />
          <path d="M6.2 6.2C3.9 7.6 2.5 10 2 12c.7 2.5 4 7 10 7 1.1 0 2.1-.2 3-.5" />
        </>
      ) : (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  return (
    <main
      className="fresh-register-wrapper"
      style={{ "--register-image": `url(${registerImage})` }}
    >
      <div className="register-card">
        {/* FreshCart cart-and-leaf logo */}
        <Link to="/" className="register-logo" aria-label="FreshCart home">
          <svg
            className="cart-icon"
            viewBox="0 0 48 48"
            width="42"
            height="42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 9H10L15 31H36L41 15H13"
              stroke="#237A40"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M24 14C23 7 30 3 39 4C39 12 34 18 26 18"
              fill="#4CAF50"
            />

            <path
              d="M26 17L34 8"
              stroke="#176B35"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <circle cx="18" cy="38" r="3" fill="#237A40" />
            <circle cx="33" cy="38" r="3" fill="#237A40" />
          </svg>

          <span>FreshCart</span>
        </Link>

        <h2>Create Account</h2>

        <p className="register-sub-text">
          Join FreshCart Learning Hub and start learning
        </p>

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="register-form-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          {/* Email */}
          <div className="register-form-group">
            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="register-form-group">
            <label htmlFor="register-password">Password</label>

            <div className="register-password-wrap">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="register-eye"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                aria-pressed={showPassword}
              >
                {renderEyeIcon(showPassword)}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="register-form-group">
            <label htmlFor="confirm-password">Confirm Password</label>

            <div className="register-password-wrap">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="register-eye"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={showConfirmPassword}
              >
                {renderEyeIcon(showConfirmPassword)}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="register-success" role="status">
              {success}
              <p>
                You can now <Link to="/login">sign in to your account</Link>.
              </p>
            </div>
          )}

          {/* Submit button */}
          {!success && (
            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <span aria-hidden="true"> →</span>}
            </button>
          )}

          <p className="register-login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>

          <Link to="/" className="register-back-home">
            ← Back to Home
          </Link>
        </form>
      </div>
    </main>
  );
};

export default Register;

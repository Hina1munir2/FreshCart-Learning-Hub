
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Login.css";
import loginImage from "../images/auth-bg.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token, res.data.user);
      navigate("/courses");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="fresh-login-wrapper"
      style={{ "--login-image": `url(${loginImage})` }}
    >
      <div className="login-card">
        {/* Green FreshCart logo with leaf */}
        <Link to="/" className="login-logo" aria-label="FreshCart home">
          <svg
            className="cart-icon"
            viewBox="0 0 48 48"
            width="42"
            height="42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Cart handle */}
            <path
              d="M4 9H10L15 31H36L41 15H13"
              stroke="#237A40"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Leaf */}
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

            {/* Wheels */}
            <circle cx="18" cy="38" r="3" fill="#237A40" />
            <circle cx="33" cy="38" r="3" fill="#237A40" />
          </svg>

          <span>FreshCart</span>
        </Link>

        <h2>Welcome Back</h2>

        <p className="sub-text">
          Sign in to continue to FreshCart Learning Hub
        </p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password">Password</label>

            <div className="password-wrap">
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="eye"
                onClick={() => setShowPass((current) => !current)}
                aria-label={showPass ? "Hide password" : "Show password"}
                aria-pressed={showPass}
              >
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
                  {showPass ? (
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
              </button>
            </div>
          </div>

          {/* Remember me and forgot password */}
          <div className="options">
            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          {/* Login error */}
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
            {!loading && <span aria-hidden="true"> →</span>}
          </button>

          {/* Sign-up link */}
          <p className="signup-text">
            Don&apos;t have an account?{" "}
            <Link to="/register">Sign up</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </form>
      </div>
    </main>
  );
};

export default Login;

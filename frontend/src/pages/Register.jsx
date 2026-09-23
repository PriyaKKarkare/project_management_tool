import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Input Change
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // =========================
  // Register
  // =========================

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Password match validation

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Password length

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        alert("Registration successful!");

        navigate("/login");
      }
    } catch (error) {
      console.error("Register Error:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "#f5f7fb",
        padding: "30px 15px",
      }}
    >
      {/* Register Wrapper */}

      <div
        style={{
          width: "100%",
          maxWidth: "430px",
        }}
      >
        {/* Register Card */}

        <div
          className="bg-white shadow-lg"
          style={{
            borderRadius: "18px",
            padding: "40px",
          }}
        >
          {/* Logo */}

          <div className="text-center mb-4">

            <div
              className="bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                fontSize: "26px",
                fontWeight: "700",
              }}
            >
              T
            </div>

            <h2 className="fw-bold text-dark mb-2">
              Create Account
            </h2>

            <p className="text-muted mb-0">
              Sign up to start using Trello Lite
            </p>

          </div>

          {/* Error */}

          {error && (
            <div
              className="alert alert-danger py-2"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Register Form */}

          <form onSubmit={handleRegister}>

            {/* Name */}

            <div className="mb-3">

              <label
                htmlFor="name"
                className="form-label fw-semibold"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

            </div>

            {/* Email */}

            <div className="mb-3">

              <label
                htmlFor="email"
                className="form-label fw-semibold"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />

            </div>

            {/* Password */}

            <div className="mb-3">

              <label
                htmlFor="password"
                className="form-label fw-semibold"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Create a password"
                autoComplete="new-password"
                minLength="6"
                required
              />

              <small className="text-muted">
                Minimum 6 characters
              </small>

            </div>

            {/* Confirm Password */}

            <div className="mb-4">

              <label
                htmlFor="confirmPassword"
                className="form-label fw-semibold"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />

            </div>

            {/* Register Button */}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>

                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

          </form>

          {/* Login Link */}

          <div className="text-center mt-4">

            <span className="text-muted">
              Already have an account?{" "}
            </span>

            <Link
              to="/login"
              className="text-primary fw-semibold text-decoration-none"
            >
              Login
            </Link>

          </div>

        </div>

        {/* Footer */}

        <p className="text-center text-muted mt-4 small">
          Trello Lite · Task & Project Management
        </p>

      </div>

    </div>
  );
};

export default Register;
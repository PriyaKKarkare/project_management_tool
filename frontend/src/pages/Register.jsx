import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
  };

  // =========================
  // Register
  // =========================

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await API.post(
        "/auth/register",
        formData
      );

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
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">

      <div
        className="card border-0 shadow-lg"
        style={{
          width: "420px",
          borderRadius: "16px",
        }}
      >

        <div className="card-body p-4">

          {/* ================= LOGO ================= */}

          <div className="text-center mb-4">

            <div
              className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "56px",
                height: "56px",
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              T
            </div>

            <h3 className="fw-bold mb-1">
              Create Account
            </h3>

            <p className="text-muted mb-0">
              Sign up to start using Trello Lite
            </p>

          </div>


          {/* ================= ERROR ================= */}

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}


          {/* ================= FORM ================= */}

          <form onSubmit={handleRegister}>

            {/* Name */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your name"
                required
              />

            </div>


            {/* Email */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email"
                required
              />

            </div>


            {/* Password */}

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
                minLength="6"
                required
              />

            </div>


            {/* Register Button */}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Sign Up"}
            </button>

          </form>


          {/* ================= LOGIN LINK ================= */}

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

      </div>

    </div>
  );
};

export default Register;
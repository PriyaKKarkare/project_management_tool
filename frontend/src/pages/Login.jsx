import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  // Login
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/auth/login", formData);

      if (response.data.success) {
        // Save logged-in user in AuthContext
        setUser(response.data.user);

        // Redirect to Dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "#f5f7fb",
        width: "100%",
        margin: 0,
        padding: "30px 15px",
      }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "16px",
        }}
      >
        <div className="card-body p-4 p-md-5">

          {/* LOGO */}
          <div className="text-center mb-4">
            <div
              className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
              style={{
                width: "58px",
                height: "58px",
                fontSize: "25px",
                fontWeight: "700",
              }}
            >
              T
            </div>

            <h2 className="fw-bold text-dark mb-2">
              Welcome Back!
            </h2>

            <p className="text-muted mb-0">
              Sign in to continue to Trello Lite
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="alert alert-danger py-2"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
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
                className="form-control form-control-lg"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
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
                className="form-control form-control-lg"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* SIGN UP */}
          <div className="text-center mt-4">
            <span className="text-muted">
              Don't have an account?{" "}
            </span>

            <Link
              to="/register"
              className="text-primary fw-semibold text-decoration-none"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div
        className="position-absolute text-center text-muted small"
        style={{
          bottom: "20px",
          left: 0,
          right: 0,
        }}
      >
        Trello Lite · Task & Project Management
      </div>
    </div>
  );
};

export default Login;
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // =========================
  // Fetch Projects
  // =========================
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/projects");

      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error("Get Projects Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================
  // Form Change
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Create Project
  // =========================
  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await API.post(
        "/projects",
        formData
      );

      if (response.data.success) {
        alert("Project created successfully");

        setFormData({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
        });

        setShowForm(false);

        fetchProjects();
      }
    } catch (error) {
      console.error("Create Project Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create project"
      );
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= MAIN ================= */}

      <main className="container py-4">

        {/* ================= PAGE HEADER ================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              My Projects
            </h2>

            <p className="text-muted mb-0">
              Manage and track your projects
            </p>
          </div>

          {/* Create Project Button */}

          {(user?.role === "admin" ||
            user?.role === "manager") && (
            <button
              className="btn btn-primary"
              onClick={() =>
                setShowForm(!showForm)
              }
            >
              {showForm
                ? "Cancel"
                : "+ Create Project"}
            </button>
          )}
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* ================= CREATE PROJECT FORM ================= */}

        {showForm && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">

              <h5 className="fw-bold mb-4">
                Create New Project
              </h5>

              <form onSubmit={handleCreateProject}>

                {/* Project Name */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Project Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>

                {/* Description */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter project description"
                    rows="3"
                  />
                </div>

                {/* Dates */}

                <div className="row">

                  {/* Start Date */}

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Start Date
                    </label>

                    <input
                      type="date"
                      name="startDate"
                      className="form-control"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>

                  {/* End Date */}

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      End Date
                    </label>

                    <input
                      type="date"
                      name="endDate"
                      className="form-control"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                {/* Buttons */}

                <div className="d-flex gap-2">

                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    Create Project
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >
                    Cancel
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mt-2">
              Loading projects...
            </p>

          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">

                <h5 className="fw-bold">
                  No Projects Found
                </h5>

                <p className="text-muted">
                  You don't have any projects yet.
                </p>

                {(user?.role === "admin" ||
                  user?.role === "manager") && (
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      setShowForm(true)
                    }
                  >
                    + Create Your First Project
                  </button>
                )}

              </div>
            </div>
          )}

        {/* ================= PROJECT LIST ================= */}

        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="row g-4">

              {projects.map((project) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={project._id}
                >

                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/projects/${project._id}`
                      )
                    }
                  >

                    <div className="card-body p-4">

                      {/* Project Name */}

                      <h5 className="card-title fw-bold mb-3">
                        {project.name}
                      </h5>

                      {/* Description */}

                      <p className="card-text text-muted">
                        {project.description ||
                          "No description available"}
                      </p>

                      <hr />

                      {/* Created By */}

                      <div className="mb-2">
                        <small className="text-muted">
                          Created by
                        </small>

                        <div className="fw-semibold">
                          {project.createdBy?.name ||
                            "Unknown"}
                        </div>
                      </div>

                      {/* Members */}

                      <div className="mb-3">
                        <small className="text-muted">
                          Members
                        </small>

                        <div>
                          <span className="badge bg-primary">
                            {project.members?.length ||
                              0}{" "}
                            Members
                          </span>
                        </div>
                      </div>

                      {/* Dates */}

                      <div className="d-flex justify-content-between">

                        {project.startDate && (
                          <small className="text-muted">
                            Start:{" "}
                            {new Date(
                              project.startDate
                            ).toLocaleDateString()}
                          </small>
                        )}

                        {project.endDate && (
                          <small className="text-muted">
                            End:{" "}
                            {new Date(
                              project.endDate
                            ).toLocaleDateString()}
                          </small>
                        )}

                      </div>

                    </div>

                    {/* Card Footer */}

                    <div className="card-footer bg-white border-0 px-4 pb-4">

                      <button
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(
                            `/projects/${project._id}`
                          );
                        }}
                      >
                        Open Project →
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

      </main>
    </div>
  );
};

export default Dashboard;
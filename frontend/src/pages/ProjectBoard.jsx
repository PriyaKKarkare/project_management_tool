import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core";

import API from "../services/api";
import TaskColumn from "../components/TaskColumn";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // =========================
  // State
  // =========================

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  // =========================
  // Fetch Tasks
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/tasks/project/${projectId}`
      );

      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Get Tasks Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

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
  // Create Task
  // =========================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      setCreatingTask(true);
      setError("");

      const response = await API.post("/tasks", {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        projectId: projectId,
      });

      if (response.data.success) {
        // Clear form
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
        });

        // Close form
        setShowForm(false);

        // Refresh tasks
        fetchTasks();
      }
    } catch (error) {
      console.error("Create Task Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create task"
      );
    } finally {
      setCreatingTask(false);
    }
  };

  // =========================
  // Drag End
  // =========================

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id;

    const validStatuses = [
      "todo",
      "in-progress",
      "done",
    ];

    // First check if dropped on a column
    let newStatus = over.id;

    // If dropped on another task,
    // get that task's status
    if (!validStatuses.includes(newStatus)) {
      const targetTask = tasks.find(
        (task) => task._id === over.id
      );

      if (targetTask) {
        newStatus = targetTask.status;
      }
    }

    // Invalid drop
    if (!validStatuses.includes(newStatus)) {
      return;
    }

    const currentTask = tasks.find(
      (task) => task._id === taskId
    );

    if (!currentTask) {
      return;
    }

    // Same column
    if (currentTask.status === newStatus) {
      return;
    }

    try {
      setError("");

      const response = await API.put(
        `/tasks/${taskId}`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  status: newStatus,
                }
              : task
          )
        );
      }
    } catch (error) {
      console.error(
        "Update Task Status Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update task status"
      );
    }
  };

  // =========================
  // Filter Tasks
  // =========================

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "done"
  );

  // =========================
  // Permission
  // =========================

  const canCreateTask =
    user?.role === "admin" ||
    user?.role === "manager";

  // =========================
  // UI
  // =========================

  return (
    <div className="min-vh-100 bg-light">

      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar />

      {/* =========================
          MAIN
      ========================= */}

      <main className="container-fluid px-3 px-md-4 py-4">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-4">

          {/* Back Button */}

          <button
            className="btn btn-outline-secondary btn-sm mb-3"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          {/* Title + Button */}

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div>
              <h1 className="fw-bold mb-1">
                Project Board
              </h1>

              <p className="text-muted mb-0">
                Manage your project tasks with
                drag and drop
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">

              <span className="badge bg-secondary px-3 py-2">
                {tasks.length}{" "}
                {tasks.length === 1
                  ? "Task"
                  : "Tasks"}
              </span>

              {canCreateTask && (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setShowForm(!showForm)
                  }
                >
                  {showForm
                    ? "Cancel"
                    : "+ Create Task"}
                </button>
              )}

            </div>

          </div>

        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div
            className="alert alert-danger d-flex justify-content-between align-items-center"
            role="alert"
          >
            <span>
              <strong>Error:</strong>{" "}
              {error}
            </span>

            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        {/* =========================
            CREATE TASK FORM
        ========================= */}

        {showForm && canCreateTask && (
          <div className="card border-0 shadow-sm mb-4">

            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">
                Create New Task
              </h5>
            </div>

            <div className="card-body">

              <form onSubmit={handleCreateTask}>

                <div className="row g-3">

                  {/* Title */}

                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      Task Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Enter task title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* Description */}

                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      placeholder="Enter task description"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>

                  </div>

                  {/* Priority */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Priority
                    </label>

                    <select
                      name="priority"
                      className="form-select"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="low">
                        Low
                      </option>

                      <option value="medium">
                        Medium
                      </option>

                      <option value="high">
                        High
                      </option>
                    </select>

                  </div>

                  {/* Due Date */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Due Date
                    </label>

                    <input
                      type="date"
                      name="dueDate"
                      className="form-control"
                      value={formData.dueDate}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* Buttons */}

                <div className="d-flex justify-content-end gap-2 mt-4">

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={creatingTask}
                  >
                    {creatingTask
                      ? "Creating..."
                      : "Create Task"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}

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

            <p className="text-muted mt-3">
              Loading tasks...
            </p>

          </div>
        )}

        {/* =========================
            BOARD
        ========================= */}

        {!loading && !error && (
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >

            <div className="row g-3 g-lg-4 align-items-start">

              {/* =========================
                  TODO
              ========================= */}

              <div className="col-12 col-md-4">

                <div className="card border-0 shadow-sm">

                  <TaskColumn
                    id="todo"
                    title="TODO"
                    tasks={todoTasks}
                  />

                </div>

              </div>

              {/* =========================
                  IN PROGRESS
              ========================= */}

              <div className="col-12 col-md-4">

                <div className="card border-0 shadow-sm">

                  <TaskColumn
                    id="in-progress"
                    title="IN PROGRESS"
                    tasks={inProgressTasks}
                  />

                </div>

              </div>

              {/* =========================
                  DONE
              ========================= */}

              <div className="col-12 col-md-4">

                <div className="card border-0 shadow-sm">

                  <TaskColumn
                    id="done"
                    title="DONE"
                    tasks={doneTasks}
                  />

                </div>

              </div>

            </div>

          </DndContext>
        )}

      </main>

    </div>
  );
};

export default ProjectBoard;
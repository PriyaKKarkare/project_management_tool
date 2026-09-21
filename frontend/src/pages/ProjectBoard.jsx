import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core";

import API from "../services/api";
import TaskColumn from "../components/TaskColumn";

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  // Drag End
  // =========================

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id;
    const newStatus = over.id;

    const validStatuses = [
      "todo",
      "in-progress",
      "done",
    ];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    const currentTask = tasks.find(
      (task) => task._id === taskId
    );

    if (!currentTask) {
      return;
    }

    // Same column → nothing to update
    if (currentTask.status === newStatus) {
      return;
    }

    try {
      // Update backend
      const response = await API.put(
        `/tasks/${taskId}`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        // Update frontend state
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

  return (
    <div>

      {/* ================= HEADER ================= */}

      <button
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <h1>Project Board</h1>

      <p>
        Project ID: {projectId}
      </p>

      {/* ================= ERROR ================= */}

      {error && (
        <p>{error}</p>
      )}

      {/* ================= LOADING ================= */}

      {loading && (
        <p>Loading tasks...</p>
      )}

      {/* ================= DRAG & DROP BOARD ================= */}

      {!loading && !error && (
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >

          <div>

            {/* TODO */}

            <TaskColumn
              id="todo"
              title="TODO"
              tasks={todoTasks}
            />


            {/* IN PROGRESS */}

            <TaskColumn
              id="in-progress"
              title="IN PROGRESS"
              tasks={inProgressTasks}
            />


            {/* DONE */}

            <TaskColumn
              id="done"
              title="DONE"
              tasks={doneTasks}
            />

          </div>

        </DndContext>
      )}

    </div>
  );
};

export default ProjectBoard;
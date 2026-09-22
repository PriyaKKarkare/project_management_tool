import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.6 : 1,
  };

  // =========================
  // Priority Badge
  // =========================

  const getPriorityClass = () => {
    switch (task.priority) {
      case "high":
        return "bg-danger-subtle text-danger";

      case "medium":
        return "bg-warning-subtle text-warning-emphasis";

      case "low":
        return "bg-success-subtle text-success";

      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card border-0 shadow-sm ${
        isDragging ? "shadow-lg" : ""
      }`}
    >

      <div className="card-body p-3">

        {/* =========================
            TOP ROW
        ========================= */}

        <div className="d-flex justify-content-between align-items-start gap-2">

          <h6 className="fw-semibold mb-2 text-dark">
            {task.title}
          </h6>

          {task.priority && (
            <span
              className={`badge rounded-pill ${getPriorityClass()}`}
            >
              {task.priority}
            </span>
          )}

        </div>

        {/* =========================
            DESCRIPTION
        ========================= */}

        {task.description && (
          <p className="text-muted small mb-3">
            {task.description}
          </p>
        )}

        {/* =========================
            ASSIGNED USER
        ========================= */}

        {task.assignedTo && (
          <div className="d-flex align-items-center gap-2 mb-2">

            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
              style={{
                width: "28px",
                height: "28px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {task.assignedTo.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <small className="text-muted">
              {task.assignedTo.name}
            </small>

          </div>
        )}

        {/* =========================
            DUE DATE
        ========================= */}

        {task.dueDate && (
          <div className="border-top pt-2 mt-2">

            <small className="text-muted">
              📅{" "}
              {new Date(
                task.dueDate
              ).toLocaleDateString()}
            </small>

          </div>
        )}

      </div>

    </div>
  );
};

export default TaskCard;
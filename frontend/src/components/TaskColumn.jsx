import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";

const TaskColumn = ({ id, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-3 p-2 ${
        isOver ? "bg-primary bg-opacity-10" : "bg-light"
      }`}
      style={{
        minHeight: "400px",
        transition: "all 0.2s ease",
      }}
    >
      {/* =========================
          COLUMN TITLE
      ========================= */}

      <div className="d-flex justify-content-between align-items-center mb-3 px-1">

        <h6 className="fw-semibold text-secondary mb-0">
          {title}
        </h6>

        <span className="badge bg-white text-secondary border rounded-pill">
          {tasks.length}
        </span>

      </div>

      {/* =========================
          TASKS
      ========================= */}

      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="d-flex flex-column gap-3">

          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
            />
          ))}

        </div>
      </SortableContext>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {tasks.length === 0 && (
        <div
          className="border border-2 border-dashed rounded-3 text-center text-muted py-5 px-2"
          style={{
            minHeight: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <div
              className="mb-2"
              style={{ fontSize: "28px" }}
            >
              +
            </div>

            <small>
              Drop tasks here
            </small>
          </div>
        </div>
      )}

      {/* =========================
          DROP INDICATOR
      ========================= */}

      {isOver && (
        <div className="text-center mt-2">
          <small className="text-primary fw-semibold">
            Drop here
          </small>
        </div>
      )}

    </div>
  );
};

export default TaskColumn;
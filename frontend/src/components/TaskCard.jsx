import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <h3>{task.title}</h3>

      <p>
        {task.description || "No description"}
      </p>

      <p>
        Priority: {task.priority}
      </p>

      <p>
        Assigned to:{" "}
        {task.assignedTo?.name || "Not assigned"}
      </p>
    </div>
  );
};

export default TaskCard;
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";

const TaskColumn = ({
  id,
  title,
  tasks,
}) => {
  const {
    setNodeRef,
  } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
    >
      <h2>
        {title} ({tasks.length})
      </h2>

      <SortableContext
        items={tasks.map(
          (task) => task._id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
          />
        ))}
      </SortableContext>

      {tasks.length === 0 && (
        <p>
          Drop tasks here
        </p>
      )}
    </div>
  );
};

export default TaskColumn;
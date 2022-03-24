import { Kanban } from "../../types/kanban";
import { useTasks } from "../../utils/task";
import { useTasksSearchParams } from "./utils";

export const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  //TODO
  const { data: allTasks } = useTasks();
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);

  return (
    <div>
      <h3>{kanban.name}</h3>
      {tasks?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
};

import { useHttp } from "./http";
import { useQuery } from "react-query";
import { cleanObject } from "./index";
import { Task } from "../types/task";

export const useTasks = (debouncedParam?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[]>(["tasks", debouncedParam], () =>
    client("tasks", { data: cleanObject(debouncedParam || {}) })
  );
};

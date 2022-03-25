import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { cleanObject } from "./index";
import { Task } from "../types/task";
import { Project } from "../types/project";
import { useAddConfig } from "./use-optimistic-options";

export const useTasks = (debouncedParam?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[]>(["tasks", debouncedParam], () =>
    client("tasks", { data: cleanObject(debouncedParam || {}) })
  );
};

export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

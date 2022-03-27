import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { cleanObject } from "./index";
import { Task } from "../types/task";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
  useReorderTaskConfig,
} from "./use-optimistic-options";
import { SortProps } from "./kanban";

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

export const useTask = (id?: number) => {
  const client = useHttp();
  return useQuery<Task>(["task", { id }], () => client(`tasks/${id}`), {
    enabled: Boolean(id),
  });
};

export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        data: params,
        method: "PATCH",
      }),
    useEditConfig(queryKey)
  );
};

export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`tasks/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: SortProps) => {
    return client("tasks/reorder", {
      data: params,
      method: "POST",
    });
  }, useReorderTaskConfig(queryKey));
};

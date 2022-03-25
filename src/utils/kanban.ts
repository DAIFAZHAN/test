import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { cleanObject } from "./index";
import { Kanban } from "../types/kanban";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";

export const useKanbans = (debouncedParam?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[]>(["kanbans", debouncedParam], () =>
    client("kanbans", { data: cleanObject(debouncedParam || {}) })
  );
};

export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};

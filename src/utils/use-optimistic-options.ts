import { QueryKey, useQueryClient } from "react-query";
import { reorder } from "./reorder";
import { Task } from "../types/task";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItem = queryClient.getQueriesData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return { previousItem };
    },
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previouseItem);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target: any, old?: any[]) =>
      old?.filter((item) => item.id !== target.id) || []
  );
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target: any, old?: any[]) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target: any, old?: any[]) =>
    old ? [...old, target] : [target]
  );

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target: any, old?: any[]) =>
    reorder({ list: old, ...target })
  );

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target: any, old?: any[]) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });

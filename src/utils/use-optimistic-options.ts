import { QueryKey, useQueryClient } from "react-query";
import { reorder } from "./reorder";
import { Task } from "../types/task";

/**
 * react query 的成功时失效刷新、mutate失败时复原
 * @param queryKey
 * @param callback
 * @returns
 */
export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey), // 失效刷新数据
    async onMutate(target: any) {
      const previousItem = queryClient.getQueriesData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return { previousItem };
    },
    // useMutation 的 onMutate 回调允许您返回一个值，该值稍后将作为最后一个参数传递给 onError 和 onSettled 处理。
    // 在大多数情况下，以这种方式来传递回滚函数是最有用的。
    // 返回值传给context
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previouseItem);
    },
  };
};

/**
 * 删除时乐观更新
 * @param queryKey
 * @returns
 */
export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target: any, old?: any[]) =>
      old?.filter((item) => item.id !== target.id) || []
  );

/**
 * 编辑时乐观更新
 * @param queryKey
 * @returns
 */
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target: any, old?: any[]) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );

/**
 * 添加时乐观更新
 * @param queryKey
 * @returns
 */
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

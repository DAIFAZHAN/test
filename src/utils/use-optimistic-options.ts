import { QueryKey, useQueryClient } from "react-query";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previouseItem = queryClient.getQueriesData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return { previouseItem };
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

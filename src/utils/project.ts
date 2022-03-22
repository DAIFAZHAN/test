import { useAsync } from "./use-async";
import { Project } from "../screens/project-list/list";
import { useHttp } from "./http";
import { useCallback, useEffect } from "react";
import { cleanObject } from "./index";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useProjectsSearchParams } from "screens/project-list/utils";

export const useProjects = (debouncedParam?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Project[]>(["projects", debouncedParam], () =>
    client("projects", { data: cleanObject(debouncedParam || {}) })
  );
};

export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  const [searchParams] = useProjectsSearchParams();
  const queryKey = ["projects", searchParams];
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: "PATCH",
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(queryKey),
      async onMutate(target) {
        const previouseItem = queryClient.getQueriesData(queryKey);
        queryClient.setQueryData(queryKey, (old?: Project[]) => {
          return (
            old?.map((project) =>
              project.id === target.id ? { ...project, ...target } : project
            ) || []
          );
        });
        return { previouseItem };
      },
      onError(error, newItem, context) {
        queryClient.setQueryData(
          queryKey,
          (context as { previouseItem: Project[] }).previouseItem
        );
      },
    }
  );
};

export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: "POST",
      }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );
};

export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      enabled: Boolean(id),
    }
  );
};

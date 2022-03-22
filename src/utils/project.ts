import { useAsync } from "./use-async";
import { Project } from "../screens/project-list/list";
import { useHttp } from "./http";
import { useCallback, useEffect } from "react";
import { cleanObject } from "./index";
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query";
import { useProjectsSearchParams } from "screens/project-list/utils";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";

export const useProjects = (debouncedParam?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Project[]>(["projects", debouncedParam], () =>
    client("projects", { data: cleanObject(debouncedParam || {}) })
  );
};

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: "PATCH",
      }),
    useEditConfig(queryKey)
  );
};

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
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

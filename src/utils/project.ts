import { useAsync } from "./use-async";
import { Project } from "../screens/project-list/list";
import { useHttp } from "./http";
import { useEffect } from "react";
import { cleanObject } from "./index";

export const useProject = (debouncedParam?: Partial<Project>) => {
  const { run, ...result } = useAsync<Project[]>();

  const client = useHttp();

  const fetchProjects = () =>
    client("projects", { data: cleanObject(debouncedParam || {}) });

  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });
  }, [debouncedParam]);

  return result;
};

export const useEditProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, { data: params, method: "PATCH" })
    );
  };
  return {
    mutate,
    ...asyncResult,
  };
};

export const useAddProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<Project>) => {
    // TODO
    return run(client("projects", { data: params, method: "POST" }));
  };
  return {
    mutate,
    ...asyncResult,
  };
};

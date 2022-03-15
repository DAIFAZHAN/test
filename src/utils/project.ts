import { useAsync } from "./use-async";
import { Project } from "../screens/project-list/list";
import { useHttp } from "./http";
import { useEffect } from "react";
import { cleanObject } from "./index";

export const useProject = (debouncedParam?: Partial<Project>) => {
  const { run, ...result } = useAsync<Project[]>();

  const client = useHttp();

  useEffect(() => {
    run(client("projects", { data: cleanObject(debouncedParam || {}) }));
  }, [debouncedParam]);

  return result;
};

import { useHttp } from "./http";
import { useQuery } from "react-query";
import { cleanObject } from "./index";
import { Kanban } from "../types/kanban";

export const useKanbans = (debouncedParam?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[]>(["kanbans", debouncedParam], () =>
    client("kanbans", { data: cleanObject(debouncedParam || {}) })
  );
};

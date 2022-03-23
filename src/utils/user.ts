import { useHttp } from "./http";
import { cleanObject, useMount } from "./index";
import { useAsync } from "./use-async";
import { User } from "../types/user";

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();

  useMount(() => {
    run(client("users", { data: cleanObject(param || {}) }));
  });

  return result;
};

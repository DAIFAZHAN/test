import { useAsync } from "./use-async";
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
import { Project } from "../types/project";

/**
 * 获取项目
 * @param param 搜索参数
 * @returns
 */
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Project[]>(["projects", cleanObject(param)], () =>
    client("projects", { data: param })
  );
};

/**
 * 编辑项目到后台，并会乐观更新
 * @param queryKey
 * @returns
 */
export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    // 与查询不同，修改通常意味着用于创建/更新/删除数据或执行服务器命令等副作用。
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: "PATCH",
      }),
    useEditConfig(queryKey)
  );
};

/**
 * 添加项目到后台，并会乐观更新
 * @param queryKey
 * @returns
 */
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

/**
 * 删除项目到后台，并会乐观更新
 * @param queryKey
 * @returns
 */
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

/**
 * useQuery查询id对应的project
 * @param id
 * @returns useQuery的结果
 */
export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`), // 查询函数实际上可以是任何一个返回 Promise 的函数。返回的 Promise 应该解决数据或引发错误。
    {
      // 直到`id`存在，查询才会被执行
      enabled: Boolean(id),
    }
  );
};

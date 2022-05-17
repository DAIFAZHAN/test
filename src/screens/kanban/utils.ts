import { useLocation } from "react-router";
import { useProject } from "../../utils/project";
import { useUrlQueryParam } from "../../utils/url";
import { useCallback, useMemo } from "react";
import { useTask } from "../../utils/task";

/**
 *
 * @returns 当前路径对应的id值
 */
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];

  return Number(id);
};

/**
 * url中id对应的具体project
 * @returns useQuery的结果
 */
export const useProjectInUrl = () => useProject(useProjectIdInUrl());

/**
 * 看板的搜索参数之一projectId
 * @returns //{ projectId: xx }
 */
export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useKanbansQueryKey = () => ["kanbans", useKanbanSearchParams()];

/**
 * url参数管理看板中的任务搜索
 * @returns
 */
export const useTasksSearchParams = () => {
  const [param, setParam] = useUrlQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  const projectId = useProjectIdInUrl();

  return useMemo(
    () => ({
      // projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: param.name,
    }),
    [
      param,
      // , projectId
    ]
  );
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];

/**
 * 编辑任务
 * @returns
 */
export const useTaskModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    "editingTaskId",
  ]);
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId)); // Boolean(Number(undefined)) 为 false
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );
  const close = () => {
    setEditingTaskId({ editingTaskId: "" });
  };

  return {
    editingTaskId,
    editingTask,
    startEdit,
    close,
    isLoading,
  };
};

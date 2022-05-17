import { useMemo } from "react";
import { useSetUrlSearchParam, useUrlQueryParam } from "utils/url";
import { useProject } from "utils/project";

// 项目列表搜索的参数
/**
 *
 * @returns url参数对象（name、personId）和set方法
 */
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ), //不加undefined选负责人不显示list，因为personId在为0时，会找不到对应项目。 0 || undefined 结果为undefined。
    setParam,
  ] as const; // 注意此处as const，否则类型推断该返回数组有问题
};

/**
 *
 * @returns ["projects", params]
 */
export const useProjectQueryKey = () => {
  const [params] = useProjectsSearchParams();
  return ["projects", params];
};

/**
 * 项目Modal创建、编辑的状态和状态修改
 * @returns
 */
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);
  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  const open = () => setProjectCreate({ projectCreate: true });

  const setUrlParams = useSetUrlSearchParam();
  const close = () => {
    // 这样会出现问题，只执行第二条
    // setProjectCreate({ projectCreate: undefined });
    // setEditingProjectId({ editingProjectId: undefined });// 可能由于后面的那一条会把前面的数据重新设置上去造成的
    setUrlParams({ projectCreate: "", editingProjectId: "" });
  };
  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });

  return {
    ProjectModalOpen: projectCreate === "true" || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};

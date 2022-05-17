/**
 * @description 处理异步，记录异步时的成功与否状态、返回的数据
 */

import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "utils";

interface State<D> {
  data: D | null;
  error: Error | null;
  stat: "idle" | "loading" | "success" | "error";
}

const defaultInitialState: State<null> = {
  data: null,
  error: null,
  stat: "idle",
};

// 用于设置run错误时返回可被catch到的promise（true时返回promise.reject）
const defaultConfig = {
  throwOnError: false,
};

/**
 * 改进dispatch，防止在组件卸载了进行赋值
 * @param dispatch 传入dispatch进行改造
 * @returns 新dispatch
 */
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};

/**
 * 可记录异步时的状态、成功的数据等
 * @param initialState
 * @param initialConfig
 * @returns
 */
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };
  // useReducer代替useState，进行复杂处理
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  );

  const safeDispatch = useSafeDispatch(dispatch);

  // useState传入函数时会自动执行，并将返回值作为state
  const [retry, setRetry] = useState(() => () => {});

  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        error: null,
        stat: "success",
      }),
    [safeDispatch]
  );

  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        data: null,
        error: error,
        stat: "error",
      }),
    [safeDispatch]
  );

  /**
   * 执行promise
   * @param promise 传入promise
   * @param runConfig 可选，若有retry属性，则保存该返回promise的函数，并可调用retry执行run
   * @returns
   */
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入Promise类型数据");
      }
      if (runConfig) {
        setRetry(() => () => {
          run(runConfig.retry(), runConfig);
        });
      }
      safeDispatch({ stat: "loading" });
      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          if (config.throwOnError) return Promise.reject(error); //意义在于若直接返回error，是兑现的promise，不会被调用者catch到，而是then
          return error;
        });
    },
    [config.throwOnError, safeDispatch, setData, setError]
  );

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    retry,
    ...state,
  };
};

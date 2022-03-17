import { useCallback, useState } from "react";
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

const defaultConfig = {
  throwOnError: false,
};

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig };
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });

  const [retry, setRetry] = useState(() => () => {});

  const mountedRef = useMountedRef();

  const setData = useCallback(
    (data: D) =>
      setState({
        data,
        error: null,
        stat: "success",
      }),
    []
  );

  const setError = useCallback(
    (error: Error) =>
      setState({
        data: null,
        error: error,
        stat: "error",
      }),
    []
  );

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
      setState((prevState) => ({ ...prevState, stat: "loading" }));
      return promise
        .then((data) => {
          if (mountedRef.current) setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          if (config.throwOnError) return Promise.reject(error); //意义在于若直接返回error，是兑现的promise，不会被调用者catch到，而是then
          return error;
        });
    },
    [config.throwOnError, mountedRef, setData, setError]
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

import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { cleanObject } from "utils";

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParam = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);
  return [
    useMemo(
      () =>
        stateKeys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      [searchParams, stateKeys]
    ),
    // setSearchParam,
    (params: Partial<{ [key in K]: unknown }>) => {
      setSearchParam(params);
    },
  ] as const;
};

//setSearchParam的通用hook
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};

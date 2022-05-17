/**
 *
 */
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { cleanObject } from "utils";

/**
 *
 * @param keys url参数的key值
 * @returns keys对应的url参数的键值对对象，和修改这些url参数的方法
 */
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

/**
 * setSearchParam的通用hook。
 * react-router-dom的useSearchParams()可获取params
 * [searchParams, setSearchParam] = useSearchParams()
 * @returns 函数。传入对象可修改url？params
 */
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams), // Object.fromEntries() 方法把键值对列表转换为一个对象，可用于Map、Array等。Object.fromEntries 是与 Object.entries() 相反的方法
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};

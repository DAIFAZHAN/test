import { useEffect, useRef, useState } from "react";

// const isFalsy = (value: unknown) => (value === 0 ? false : !value);
// //可能导致值为false的被删除
const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";

export const cleanObject = (object?: { [key: string]: unknown }) => {
  if (!object) {
    return {};
  }
  // Object.assign({},object)
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    // @ts-ignore
    if (isVoid(result[key])) {
      // @ts-ignore
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
};

/**
 * 防抖
 * @param value
 * @param delay
 * @returns
 */
export const useDebounce = <V>(value: V, delay: number) => {
  const [debouncedValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 修改标签页名
 * @param title
 * @param keepOnUnmount false时离开页面变回原来标题（true时保留标题）
 */
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = useRef(document.title).current;

  useEffect(() => {
    document.title = title;
  }, [title]);

  // 离开页面变回原来标题（或保留标题）
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

export const resetRoute = () => {
  window.location.href = window.location.origin;
};

/**
 * 用useRef阻止在已卸载组件上赋值
 * @returns 返回mountedRef，当mountedRef.current为false时为已卸载
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });

  return mountedRef;
};

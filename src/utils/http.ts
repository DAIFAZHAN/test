/**
 * @description 发送带有token的http请求
 */
import { logout } from "../auth-provider";
import qs from "qs";
import { useAuth } from "../context/auth-context";
import { useCallback } from "react";

interface Config extends RequestInit {
  data?: object;
  token?: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

/**
 *
 * @param endpoint 访问的路径，如login或者me，最前面不加/
 * @param param1 fetch的配置，默认GET，可传入token、data（get时作为?query，其他作为body）
 * @returns fetch的promise
 */
export const http = (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += "?" + qs.stringify(data);
  } else {
    config.body = JSON.stringify(data || {});
  }

  return fetch(`${apiUrl}/${endpoint}`, config).then(async (response) => {
    if (response.status === 401) {
      // 状态码401需要验证身份
      await logout();
      window.location.reload(); // 刷新页面
      return Promise.reject("请重新登录");
    }
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

/**
 * 发送带有token的http请求
 * @returns 带有token的http方法，第一个参数为地址，第二个参数为fetch的配置
 */
export const useHttp = () => {
  const { user } = useAuth();
  return useCallback(
    // 依赖项token改变才会返回新的函数
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  );
};

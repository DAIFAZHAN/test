/**
 * @description localStorage 与 后端 进行登录用户信息的交互
 * getToken: 从本地获取token
 * handleUserResponse: 将user的token存储本地
 *
 * login: 传入用户密码，进行handleUserResponse
 * register: 传入用户密码，进行handleUserResponse
 * logout: removeItem
 */
import { User } from "./types/user";

const apiUrl = process.env.REACT_APP_API_URL;

/**
 * token在localStorage的key
 */
const localStorageKey = "__auth_provider_token__";

/**
 * 从本地获取token
 * @returns
 */
export const getToken = () => window.localStorage.getItem(localStorageKey);

/**
 *
 * @param user 用户信息
 * @returns 用户信息
 */
export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(localStorageKey, user.token || "");
  return user;
};

/**
 * 访问远程/login进行登录，用handleUserResponse将token存储本地
 * @param data 账户密码
 * @returns promise
 */
export const login = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      return handleUserResponse(await response.json());
    } else {
      // return Promise.reject(data);
      return Promise.reject(await response.json());
    }
  });
};

/**
 * 访问/register进行注册，用handleUserResponse将token存储本地
 * @param data 账户密码
 * @returns promise
 */
export const register = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      return handleUserResponse(await response.json());
    } else {
      // return Promise.reject(data);
      return Promise.reject(await response.json());
    }
  });
};

/**
 * 退出登录，removeItem移除本地token
 * @returns
 */
export const logout = async () =>
  window.localStorage.removeItem(localStorageKey);

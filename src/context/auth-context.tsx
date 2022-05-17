/**
 * @description context的provider。
 * 全局提供user的信息user，方法login、register、logout。可用useAuth()获取
 */

import React, { ReactNode } from "react";
import * as auth from "auth-provider";
import { http } from "../utils/http";
import { useMount } from "../utils";
import { useAsync } from "../utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "../components/lib";
import { useQueryClient } from "react-query";
import { User } from "../types/user";

interface AuthForm {
  username: string;
  password: string;
}

const AuthContext = React.createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "authContext";

/**
 * 由token异步读取user信息
 * @returns user信息
 */
const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token: token });
    user = data.user;
  }
  return user;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const [user, setUser] = React.useState<User | null>(null);
  const {
    data: user,
    setData: setUser,
    error,
    run,
    isIdle,
    isLoading,
    isError,
  } = useAsync<User | null>();

  const queryClient = useQueryClient();
  //point free
  const login = (form: AuthForm) => auth.login(form).then(setUser); //等同于.then(user=>setUser(user))函数式编程
  const register = (form: AuthForm) =>
    auth.register(form).then((user) => setUser(user));
  const logout = () =>
    auth.logout().then(() => {
      setUser(null);
      queryClient.clear();
    });

  // 加载组件时，读取user信息
  useMount(() => {
    run(bootstrapUser());
  });

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

/**
 * 全局状态，用户授权信息
 * @returns
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};

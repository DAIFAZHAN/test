import React, { ReactNode } from "react";
import * as auth from "auth-provider";
import { User } from "../screens/project-list/search-panel";
import { http } from "../utils/http";
import { useMount } from "../utils";
import { useAsync } from "../utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "../components/lib";
import { useQueryClient } from "react-query";

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

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};

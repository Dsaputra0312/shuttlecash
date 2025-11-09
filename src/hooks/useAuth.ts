import { useCallback } from "react";
import { useDataStore } from "../store/useDataStore";
import { useApi } from "./useApi";

export function useAuth() {
  const {
    login: storeLogin,
    logout: storeLogout,
    checkAuth: storeCheckAuth,
  } = useDataStore();

  const loginApi = useApi(async (username: string, password: string) => {
    await storeLogin(username, password);
    return { success: true };
  });

  const logoutApi = useApi(async () => {
    storeLogout();
    return { success: true };
  });

  const checkAuthApi = useApi(async () => {
    await storeCheckAuth();
    return { success: true };
  });

  const loginCallback = useCallback((username: string, password: string) => {
    loginApi.execute(username, password);
  }, []);

  const logoutCallback = useCallback(() => {
    logoutApi.execute();
  }, []);

  const checkAuthCallback = useCallback(() => {
    checkAuthApi.execute();
  }, []);

  return {
    login: loginCallback,
    logout: logoutCallback,
    checkAuth: checkAuthCallback,
    loginLoading: loginApi.loading,
    logoutLoading: logoutApi.loading,
    checkAuthLoading: checkAuthApi.loading,
    loginError: loginApi.error,
    logoutError: logoutApi.error,
    checkAuthError: checkAuthApi.error,
  };
}

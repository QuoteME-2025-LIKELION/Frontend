import axios from "axios";
import type { CreateAxiosDefaults, InternalAxiosRequestConfig } from "axios";

interface Session {
  version: number;
  token: string | null;
  refreshAccessToken: (token: string) => void;
  logout: () => void;
}

type SessionConfig = InternalAxiosRequestConfig & {
  sessionVersion?: number;
  sessionToken?: string | null;
  retriedAfterRefresh?: boolean;
};

/** 쿠키로 재발급하고 기존 요청을 한 번만 재시도한다. */
export function createSessionApi(
  defaults: CreateAxiosDefaults,
  getSession: () => Session
) {
  const api = axios.create(defaults);
  // 인터셉터를 분리해 재발급 요청 자체의 재시도를 방지한다.
  const refreshApi = axios.create(defaults);
  const refreshes = new Map<number, Promise<void>>();

  const refresh = (version: number) => {
    const existing = refreshes.get(version);
    if (existing) return existing;

    const pending = (async () => {
      try {
        const response = await refreshApi.post("/api/auth/refresh");
        if (getSession().version !== version) {
          throw new axios.CanceledError("Session changed during refresh");
        }
        const token: unknown = response.data?.data?.accessToken;
        if (typeof token !== "string" || !token.trim()) {
          throw new Error("Missing access token in refresh response");
        }
        getSession().refreshAccessToken(token);
      } catch (error) {
        if (getSession().version === version) getSession().logout();
        throw error;
      } finally {
        refreshes.delete(version);
      }
    })();
    refreshes.set(version, pending);
    return pending;
  };

  api.interceptors.request.use((config: SessionConfig) => {
    const session = getSession();
    if (
      config.sessionVersion !== undefined &&
      config.sessionVersion !== session.version
    ) {
      throw new axios.CanceledError("Session changed before retry");
    }
    config.sessionVersion = session.version;
    config.sessionToken = session.token;
    if (session.token) config.headers.Authorization = `Bearer ${session.token}`;
    else config.headers.delete("Authorization");
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.config) throw error;
      const config = error.config as SessionConfig;
      const status = error.response?.status;
      const data = error.response?.data;
      const isUnauthenticated = status === 401 || (
        status === 403 &&
        (data?.resultCode === "403-1" || data?.message === "403-1")
      );
      // 잘못된 로그인 및 로그아웃 실패를 재발급 대상으로 취급하지 않는다.
      const isAuthRequest = /\/api\/auth(?:\/|$)/.test(config.url ?? "");
      if (!isUnauthenticated || isAuthRequest) throw error;

      const session = getSession();
      if (config.sessionVersion !== session.version) {
        throw new axios.CanceledError("Response belongs to an old session");
      }
      if (config.retriedAfterRefresh || !session.token) {
        session.logout();
        throw error;
      }
      config.retriedAfterRefresh = true;
      // 다른 요청이 이미 토큰을 갱신했다면 추가 재발급 없이 재시도한다.
      if (config.sessionToken === session.token) await refresh(session.version);
      return api.request(config);
    }
  );

  return api;
}

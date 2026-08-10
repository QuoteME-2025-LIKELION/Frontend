import api from "@/api/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  birthYear: string;
}

interface AuthTokenResponse {
  data?: {
    accessToken?: string;
  };
}

/**
 * 인증 관련 API 함수 분리
 */
export const authApi = {
  login: (payload: LoginRequest) =>
    api.post<AuthTokenResponse>("/api/auth/login", payload),
  signup: (payload: SignUpRequest) =>
    api.post<AuthTokenResponse>("/api/auth/signup", payload),
  logout: () => api.post("/api/auth/logout"),
  redirectToOAuthProvider: (provider: string) => {
    window.location.assign(
      `${import.meta.env.VITE_API_URL}/oauth2/authorization/${provider}`
    );
  },
};

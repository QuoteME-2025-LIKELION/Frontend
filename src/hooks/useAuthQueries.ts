import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  authApi,
  type LoginRequest,
  type OAuthMode,
  type SignUpRequest,
} from "@/api/authApi";
import useAuthStore from "@/stores/useAuthStore";
import { resolveOAuthCallback } from "@/utils/oauthCallback";

/**
 * OAuth provider 인증 페이지로 이동
 */
export function useOAuthRedirect() {
  return (provider: string, mode: OAuthMode) => {
    authApi.redirectToOAuthProvider(provider, mode);
  };
}

/**
 * OAuth callback URL의 accessToken을 인증 상태에 반영하고 다음 화면으로 이동
 */
export function useOAuthCallbackFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const queryClient = useQueryClient();
  const handled = useRef(false);

  useEffect(() => {
    if (isLoading || handled.current) return;
    handled.current = true;
    const result = resolveOAuthCallback(searchParams);
    if (result.token) login(result.token);
    if (result.linked) void queryClient.invalidateQueries({ queryKey: ["profile"] });
    navigate(result.path, {
      replace: true,
      state: result.message ? { oauthMessage: result.message } : null,
    });
  }, [isLoading, login, navigate, queryClient, searchParams]);
}

/**
 * 로그인 요청
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
  });
}

/**
 * 회원가입 요청
 */
export function useSignUpMutation() {
  return useMutation({
    mutationFn: (payload: SignUpRequest) => authApi.signup(payload),
  });
}

/**
 * 로그아웃 요청 후 전체 React Query 캐시 제거
 */
export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      useAuthStore.getState().logout();
    },
  });
}

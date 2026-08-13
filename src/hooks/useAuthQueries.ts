import {
  authApi,
  type LoginRequest,
  type SignUpRequest,
} from "@/api/authApi";
import useAuthStore from "@/stores/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * OAuth provider 인증 페이지로 이동
 */
export function useOAuthRedirect() {
  return (provider: string) => {
    authApi.redirectToOAuthProvider(provider);
  };
}

/**
 * OAuth callback URL의 accessToken을 인증 상태에 반영하고 다음 화면으로 이동
 */
export function useOAuthCallbackFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const token = searchParams.get("accessToken");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    login(token);
    navigate("/profile", { replace: true });
  }, [login, navigate, searchParams]);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

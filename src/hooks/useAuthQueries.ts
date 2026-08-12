import {
  authApi,
  type LoginRequest,
  type SignUpRequest,
} from "@/api/authApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * OAuth provider 인증 페이지로 이동
 */
export function useOAuthRedirect() {
  return (provider: string) => {
    authApi.redirectToOAuthProvider(provider);
  };
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

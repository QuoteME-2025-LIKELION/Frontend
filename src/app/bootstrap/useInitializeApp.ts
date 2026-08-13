import { useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";

/**
 * 앱 시작 시 필요한 인증/알림 초기화 흐름
 * bootstrap hook으로 분리
 */
export function useInitializeApp() {
  const { isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    // 새로고침 후 localStorage의 토큰을 기준으로 인증 상태 복원
    initializeAuth();
  }, [initializeAuth]);

  return { isLoading };
}

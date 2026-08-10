import { useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";
import useNotificationStore from "@/stores/useNotificationStore";

/**
 * 앱 시작 시 필요한 인증/알림 초기화 흐름
 * bootstrap hook으로 분리
 */
export function useInitializeApp() {
  const { isLoading, isAuthenticated, initializeAuth } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    // 새로고침 후 localStorage의 토큰을 기준으로 인증 상태 복원
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // 인증 복원이 끝난 뒤 로그인 상태일 때만 알림 상태를 가져옴
    if (!isLoading && isAuthenticated) {
      fetchNotifications();
    }
  }, [isLoading, isAuthenticated, fetchNotifications]);

  return { isLoading };
}

// src/stores/useAuthStore.ts
import { create } from "zustand";
import { tokenStorage } from "@/utils/tokenStorage";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void; // 앱 초기 로딩 시 토큰 확인
}

/**
 * 사용자 인증 상태를 관리하는 Zustand 스토어
 * - isAuthenticated: 토큰이 유효하여 인증되었는지 여부
 * - isLoading: 앱 초기화 시 토큰을 확인하는 중인지 여부
 */
const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true, // 초기 로딩 상태는 true로 설정

  // 앱 초기 실행 시 로컬 스토리지 토큰 확인
  initializeAuth: () => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      set({ isAuthenticated: true });
    }
    // 토큰 확인 후 로딩 상태를 false로 변경
    set({ isLoading: false });
  },

  // 로그인 성공 시 토큰 저장 및 상태 업데이트
  login: (token) => {
    tokenStorage.setAccessToken(token);
    set({ isAuthenticated: true, isLoading: false });
  },

  // 로그아웃 시 토큰 제거 및 상태 업데이트 (로그아웃 백엔드 API는 아직 미구현)
  logout: () => {
    tokenStorage.removeAccessToken();
    set({ isAuthenticated: false, isLoading: false });
  },
}));

export default useAuthStore;

// src/stores/useAuthStore.ts
import { create } from "zustand";

import { queryClient } from "@/app/queryClient";
import useNotificationStore from "@/stores/useNotificationStore";
import { getAccessTokenExpiry } from "@/utils/accessTokenExpiry";
import { tokenStorage } from "@/utils/tokenStorage";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionVersion: number;
  accessTokenExpiresAt: number | null;
  refreshAccessToken: (token: string) => void;
  login: (token: string) => void;
  logout: () => void;
  initializeAuth: () => void; // 앱 초기 로딩 시 토큰 확인
}

/**
 * 사용자 인증 상태를 관리하는 Zustand 스토어
 * - isAuthenticated: 토큰이 유효하여 인증되었는지 여부
 * - isLoading: 앱 초기화 시 토큰을 확인하는 중인지 여부
 */
const useAuthStore = create<AuthState>((set, get) => ({
  sessionVersion: 0,
  accessTokenExpiresAt: null,
  isAuthenticated: false,
  isLoading: true, // 초기 로딩 상태는 true로 설정

  // 앱 초기 실행 시 로컬 스토리지 토큰 확인
  initializeAuth: () => {
    const token = tokenStorage.getAccessToken();
    set({
      isAuthenticated: Boolean(token),
      accessTokenExpiresAt: getAccessTokenExpiry(token),
      isLoading: false,
    });
  },

  // 로그인 성공 시 토큰 저장 및 상태 업데이트
  login: (token) => {
    queryClient.clear();
    useNotificationStore.getState().setHasUnread(false);
    tokenStorage.setAccessToken(token);
    set({ isAuthenticated: true, isLoading: false, accessTokenExpiresAt: getAccessTokenExpiry(token), sessionVersion: get().sessionVersion + 1 });
  },

  // 재발급은 계정 전환이 아니므로 캐시와 세션 버전을 유지한다.
  refreshAccessToken: (token) => {
    tokenStorage.setAccessToken(token);
    set({ accessTokenExpiresAt: getAccessTokenExpiry(token) });
  },

  // 로컬 세션 종료. 사용자 로그아웃은 서버 API 성공 후 호출한다.
  logout: () => {
    queryClient.clear();
    useNotificationStore.getState().setHasUnread(false);
    tokenStorage.removeAccessToken();
    set({ isAuthenticated: false, isLoading: false, accessTokenExpiresAt: null, sessionVersion: get().sessionVersion + 1 });
  },
}));

export default useAuthStore;

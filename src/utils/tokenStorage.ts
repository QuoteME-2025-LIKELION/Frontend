const ACCESS_TOKEN_KEY = "accessToken";

/**
 * accessToken의 localStorage 접근을 한 곳에서 관리
 * 토큰 키나 저장 방식이 바뀔 때 호출부 수정 범위를 줄이기 위해 분리
 */
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  removeAccessToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

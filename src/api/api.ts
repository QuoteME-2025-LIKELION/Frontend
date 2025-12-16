import useAuthStore from "@/stores/useAuthStore";
import axios from "axios";

/**
 * Axios 인스턴스
 * - baseURL: 환경 변수에서 API URL을 가져옴
 * - 요청 인터셉터: 로컬 스토리지에서 액세스 토큰을 가져와 Authorization 헤더에 추가
 * - 백엔드 배포 링크를 직접 쓸 필요가 없고, 해당하는 api 링크 부분만 문자열로 넘기면 됩니다.
 * - 요청 시마다 토큰을 자동으로 포함시킵니다.
 * @example
 * import api from '@/api/api';
 * const response = await api.get("/api/posts");
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("API REQUEST INTERCEPTOR - TOKEN:", token);

    // 토큰이 존재하면 Authorization 헤더에 'Bearer' 토큰 형식으로 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 Unauthorized 또는 403 Forbidden 응답 확인
    if (error.response.status === 401 || error.response.status === 403) {
      // 토큰이 유효하지 않거나 만료된 경우
      console.log("인증 에러 감지. 자동 로그아웃 처리 시작.");

      // Auth Store의 logout 함수로 상태 변경, 토큰 제거
      useAuthStore.getState().logout();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

import useAuthStore from "@/stores/useAuthStore";
import { tokenStorage } from "@/utils/tokenStorage";

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
    const token = tokenStorage.getAccessToken();

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
    const status = axios.isAxiosError(error) ? error.response?.status : null;

    if (status === 401 || status === 403) {
      // 토큰이 유효하지 않거나 만료된 경우
      useAuthStore.getState().logout();

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;

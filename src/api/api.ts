import { createSessionApi } from "@/api/createSessionApi";
import useAuthStore from "@/stores/useAuthStore";
import { tokenStorage } from "@/utils/tokenStorage";

const api = createSessionApi(
  { baseURL: import.meta.env.VITE_API_URL, withCredentials: true },
  () => {
    const state = useAuthStore.getState();
    return {
      version: state.sessionVersion,
      token: tokenStorage.getAccessToken(),
      refreshAccessToken: state.refreshAccessToken,
      logout: state.logout,
    };
  }
);

export default api;

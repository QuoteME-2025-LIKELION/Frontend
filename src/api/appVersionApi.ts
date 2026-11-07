import api from "@/api/api";

export interface AppVersionResponse {
  latestVersion: string;
  updateNote: string;
}

export const appVersionApi = {
  getVersion: () => api.get<AppVersionResponse>("/api/app-version"),
};

import { useQuery } from "@tanstack/react-query";

import { appVersionApi } from "@/api/appVersionApi";

export function useAppVersionQuery(enabled = true) {
  return useQuery({
    queryKey: ["app-version"],
    queryFn: async () => {
      const { data } = await appVersionApi.getVersion();
      if (typeof data.latestVersion !== "string" || !data.latestVersion.trim()) {
        throw new Error("Invalid app version response");
      }
      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

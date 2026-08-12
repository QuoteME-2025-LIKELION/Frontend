import { profileApi, type SetupProfileRequest } from "@/api/profileApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const profileQueryKeys = {
  all: ["profile"] as const,
  settings: () => [...profileQueryKeys.all, "settings"] as const,
};

/**
 * 프로필 관리 화면에서 사용하는 설정 프로필 정보 조회
 */
export function useSettingsProfileQuery() {
  return useQuery({
    queryKey: profileQueryKeys.settings(),
    queryFn: async () => {
      const res = await profileApi.getSettingsProfile();
      return res.data;
    },
  });
}

/**
 * 설정 프로필을 수정한 뒤 프로필 조회 캐시 갱신
 */
export function useUpdateSettingsProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SetupProfileRequest) =>
      profileApi.updateSettingsProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.settings() });
    },
  });
}

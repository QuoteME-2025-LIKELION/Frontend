import {
  profileApi,
  type SetupProfileRequest,
  type UpdateAccountRequest,
} from "@/api/profileApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const profileQueryKeys = {
  all: ["profile"] as const,
  my: () => [...profileQueryKeys.all, "my"] as const,
  settings: () => [...profileQueryKeys.all, "settings"] as const,
  account: () => [...profileQueryKeys.all, "account"] as const,
};

/**
 * 현재 로그인한 내 프로필 정보 조회
 */
export function useMyProfileQuery() {
  return useQuery({
    queryKey: profileQueryKeys.my(),
    queryFn: async () => {
      const res = await profileApi.getMyProfile();
      return res.data;
    },
  });
}

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

/**
 * 회원가입 프로필 설정 후 내 프로필 캐시 갱신
 */
export function useSetupProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SetupProfileRequest) =>
      profileApi.setupProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.my() });
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.settings() });
    },
  });
}

/**
 * 계정 설정 화면에서 사용하는 계정 프로필 정보 조회
 */
export function useAccountProfileQuery() {
  return useQuery({
    queryKey: profileQueryKeys.account(),
    queryFn: async () => {
      const res = await profileApi.getAccountProfile();
      return res.data;
    },
  });
}

/**
 * 계정 정보를 수정한 뒤 계정 프로필 캐시 갱신
 */
export function useUpdateAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAccountRequest) =>
      profileApi.updateAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.account() });
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.my() });
    },
  });
}

/**
 * 계정 삭제 요청 후 프로필 관련 캐시 제거
 */
export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileApi.deleteAccount(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: profileQueryKeys.all });
    },
  });
}

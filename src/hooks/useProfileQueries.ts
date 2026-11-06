import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  profileApi,
  type DeleteAccountRequest,
  type SetupProfileRequest,
  type UpdateSettingsProfileRequest,
  type UpdateAccountRequest,
} from "@/api/profileApi";
import useAuthStore from "@/stores/useAuthStore";
import { getSessionCheckDelay } from "@/utils/accessTokenExpiry";
import { saveSignupProfile } from "@/utils/saveSignupProfile";

export const profileQueryKeys = {
  all: ["profile"] as const,
  my: () => [...profileQueryKeys.all, "my"] as const,
  other: (memberId: number | string) =>
    [...profileQueryKeys.all, "other", String(memberId)] as const,
  settings: () => [...profileQueryKeys.all, "settings"] as const,
  account: () => [...profileQueryKeys.all, "account"] as const,
};

/**
 * 현재 로그인한 내 프로필 정보 조회
 */
export function useMyProfileQuery(verifySession = false) {
  const { isAuthenticated, isLoading, accessTokenExpiresAt } = useAuthStore();
  return useQuery({
    queryKey: profileQueryKeys.my(),
    queryFn: async ({ signal }) => {
      const res = await profileApi.getMyProfile(signal);
      if (!res.data || !Number.isSafeInteger(res.data.id) || res.data.id <= 0 ||
          typeof res.data.nickname !== "string") {
        throw new Error("Invalid profile response");
      }
      return res.data;
    },
    enabled: !isLoading && isAuthenticated,
    retry: verifySession ? false : 1,
    refetchOnMount: verifySession ? "always" : true,
    refetchOnWindowFocus: verifySession ? "always" : false,
    refetchOnReconnect: verifySession ? "always" : true,
    refetchInterval: verifySession ? () => getSessionCheckDelay(accessTokenExpiresAt) : false,
  });
}

/**
 * 타인 프로필 정보 조회
 */
export function useOtherProfileQuery(memberId: number | string | undefined) {
  return useQuery({
    queryKey: profileQueryKeys.other(memberId ?? ""),
    queryFn: async () => {
      const res = await profileApi.getOtherProfile(memberId!);
      return res.data;
    },
    enabled: memberId !== undefined,
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
    mutationFn: (payload: UpdateSettingsProfileRequest) =>
      profileApi.updateSettingsProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.my() });
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
      saveSignupProfile(payload, profileApi),
    retry: false,
    // 두 저장 중 하나만 성공해도 실제 계정/프로필 상태를 다시 불러온다.
    onSettled: () => queryClient.invalidateQueries({ queryKey: profileQueryKeys.all }),
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
    mutationFn: (payload: DeleteAccountRequest) =>
      profileApi.deleteAccount(payload),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: profileQueryKeys.all });
    },
  });
}

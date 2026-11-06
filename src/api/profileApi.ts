import api from "@/api/api";

export interface UpdateSettingsProfileRequest {
  nickname: string;
  introduction: string;
  image?: File | null;
}

export interface SetupProfileRequest extends UpdateSettingsProfileRequest {
  birthYear: number;
}

export interface UpdateAccountRequest {
  email: string;
  birthYear: string;
  gender: "MALE" | "FEMALE" | "ETC";
}

export interface DeleteAccountRequest {
  selectedReasons: string[];
  otherReason?: string;
}

export type LinkedProvider = "GOOGLE" | "KAKAO";

export interface AccountProfileResponse {
  linkedAccounts?: Array<{ provider: LinkedProvider; linkedAt: string }>;
  providerId?: string | null;
  provider?: "LOCAL" | "GOOGLE" | "KAKAO" | null;
  email?: string;
  birthYear?: string | number | null;
  gender?: "MALE" | "FEMALE" | "ETC" | null;
}

export interface MyProfileResponse {
  id: number;
  nickname: string;
  introduction?: string;
  profileImageUrl?: string;
  profileImage?: string;
  email?: string;
}

export type SettingsProfileResponse = MyProfileResponse;

/**
 * FormData를 만들어주는 유틸 함수
 * - 프로필 이미지 업로드를 위해 multipart/form-data로 요청
 */
function createProfileFormData({
  nickname,
  introduction,
  image,
}: UpdateSettingsProfileRequest) {
  const formData = new FormData();

  if (image) {
    formData.append("image", image);
  }

  formData.append(
    "data",
    new Blob([JSON.stringify({ nickname, introduction })], {
      type: "application/json",
    })
  );

  return formData;
}

/**
 * 프로필 관련 API 함수 분리
 */
export const profileApi = {
  setupProfile: (payload: UpdateSettingsProfileRequest) =>
    api.put("/api/profile", createProfileFormData(payload)),
  getMyProfile: (signal?: AbortSignal) =>
    api.get<MyProfileResponse>("/api/profile", { signal, timeout: 15_000 }),
  getOtherProfile: (memberId: number | string) =>
    api.get<MyProfileResponse>(`/api/profile/${memberId}`),
  getSettingsProfile: () => api.get<SettingsProfileResponse>("/api/profile"),
  updateSettingsProfile: (payload: UpdateSettingsProfileRequest) =>
    api.put("/api/profile", createProfileFormData(payload)),
  getAccountLinkUrl: (provider: LinkedProvider) =>
    `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/profile/account/link/${provider.toLowerCase()}`,
  getAccountProfile: () =>
    api.get<AccountProfileResponse>("/api/profile/account"),
  updateAccount: (payload: UpdateAccountRequest) =>
    api.put("/api/profile/account", payload),
  deleteAccount: (payload: DeleteAccountRequest) =>
    api.delete("/api/profile/account", { data: payload }),
};

import api from "@/api/api";

export interface SetupProfileRequest {
  nickname: string;
  introduction: string;
  image?: File | null;
}

export interface UpdateAccountRequest {
  gender: string;
  birthYear: string;
}

export interface AccountProfileResponse {
  gender: string;
  birthYear: number;
  email?: string;
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
}: SetupProfileRequest) {
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
  setupProfile: (payload: SetupProfileRequest) =>
    api.put("/api/profile", createProfileFormData(payload)),
  getMyProfile: () => api.get<MyProfileResponse>("/api/profile"),
  getOtherProfile: (memberId: number | string) =>
    api.get<MyProfileResponse>(`/api/profile/${memberId}`),
  getSettingsProfile: () => api.get<SettingsProfileResponse>("/api/profile"),
  updateSettingsProfile: (payload: SetupProfileRequest) =>
    api.put("/api/profile", createProfileFormData(payload)),
  getAccountProfile: () =>
    api.get<AccountProfileResponse>("/api/profile/account"),
  updateAccount: (payload: UpdateAccountRequest) =>
    api.put("/api/profile/account", payload),
  deleteAccount: () => api.delete("/api/profile/account"),
};

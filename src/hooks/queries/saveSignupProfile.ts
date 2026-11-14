import type { SetupProfileRequest, profileApi } from "@/api/profileApi";

/** 사진 저장을 먼저 마친 뒤 setup으로 가입 설정을 완료한다. */
export async function saveSignupProfile(
  { birthYear, image, nickname, introduction }: SetupProfileRequest,
  api: Pick<typeof profileApi, "updateSettingsProfile" | "setupProfile">
) {
  const year = String(birthYear);
  if (!/^\d{4}$/.test(year) || birthYear < 1900 || birthYear > new Date().getFullYear()) {
    throw new Error("Invalid birth year");
  }
  // 사진 실패 시 완료 상태가 true가 되어 설정 화면을 떠나는 것을 방지한다.
  if (image) await api.updateSettingsProfile({ nickname, introduction, image });
  return api.setupProfile({ nickname, introduction, birthYear: year });
}

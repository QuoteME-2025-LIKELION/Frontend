import type { SetupProfileRequest, profileApi } from "@/api/profileApi";

/** 계정 정보와 표시용 프로필을 각각 지원하는 API에 저장한다. */
export async function saveSignupProfile(
  { birthYear, ...profile }: SetupProfileRequest,
  api: Pick<typeof profileApi, "getAccountProfile" | "updateAccount" | "setupProfile">
) {
  const year = String(birthYear);
  if (!/^\d{4}$/.test(year) || birthYear < 1900 || birthYear > new Date().getFullYear()) {
    throw new Error("Invalid birth year");
  }
  const { data: account } = await api.getAccountProfile();
  if (!account.email) throw new Error("Missing account email");
  const gender = account.gender ?? "ETC";
  if (gender !== "MALE" && gender !== "FEMALE" && gender !== "ETC") {
    throw new Error("Unsupported account gender");
  }
  // 계정 저장을 먼저 완료해 실패 시 이미지 업로드를 반복하지 않는다.
  if (String(account.birthYear ?? "") !== year || account.gender == null) {
    await api.updateAccount({ email: account.email, birthYear: year, gender });
  }
  return api.setupProfile(profile);
}

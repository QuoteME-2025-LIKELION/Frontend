import type { AccountProfileResponse } from "@/api/profileApi";

export const MOCK_PROFILE_IMAGE = "/favicons/favicon-96x96.png";

export const mockAccountInfo: AccountProfileResponse = {
  gender: "MALE",
  birthYear: "2000",
  email: "guest@quoteme.com",
  provider: "GOOGLE",
  linkedAccounts: [
    { provider: "GOOGLE", linkedAt: "2026-03-01T10:00:00" },
    { provider: "KAKAO", linkedAt: "2026-03-02T10:00:00" },
  ],
};

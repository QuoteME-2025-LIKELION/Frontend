import { http, HttpResponse } from "msw";

import type { UpdateAccountRequest } from "@/api/profileApi";

import { MOCK_PROFILE_IMAGE, mockState } from "../state";

export const profileHandlers = [
  // ==========================================
  // 2. 프로필 (Profile)
  // ==========================================
  http.get("/api/profile", () => {
    return HttpResponse.json({
      id: 1,
      profileCompleted: true,
      nickname: "손지수",
      email: "guest@quoteme.com",
      introduction: "긍정의 힘을 믿어요",
      profileImageUrl: MOCK_PROFILE_IMAGE,
      profileImage: MOCK_PROFILE_IMAGE,
    });
  }),
  // 현재 목 세션은 게스트이며 setup은 서버 계약상 허용되지 않는다.
  http.put("/api/profile/setup", () =>
    HttpResponse.json({ message: "게스트는 프로필을 설정할 수 없습니다." }, { status: 403 })
  ),
  http.put("/api/profile", async () => {
    // multipart/form-data 처리
    return HttpResponse.json({
      id: 1,
      profileCompleted: true,
      nickname: "수정된닉네임",
      email: "guest@quoteme.com",
      introduction: "프로필이 수정되었습니다.",
      profileImageUrl: MOCK_PROFILE_IMAGE,
      profileImage: MOCK_PROFILE_IMAGE,
    });
  }),
  http.get("/api/profile/account", () =>
    HttpResponse.json(mockState.mockAccountInfo)
  ),
  http.put("/api/profile/account", async ({ request }) => {
    const body = (await request.json()) as Partial<UpdateAccountRequest>;
    if (
      !body.email ||
      !/^\d{4}$/.test(body.birthYear ?? "") ||
      Number(body.birthYear) < 1900 ||
      Number(body.birthYear) > new Date().getFullYear() ||
      !["MALE", "FEMALE", "ETC"].includes(body.gender ?? "")
    ) {
      return HttpResponse.json(
        { message: "계정 정보를 확인해 주세요." },
        { status: 400 }
      );
    }
    mockState.mockAccountInfo = { ...mockState.mockAccountInfo, ...body };
    return HttpResponse.json("계정 정보가 수정되었습니다.");
  }),
  http.delete("/api/profile/account", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get("/api/profile/:id", ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      nickname: `타인_${params.id}`,
      introduction: "타인 프로필 소개글입니다.",
      profileImageUrl: MOCK_PROFILE_IMAGE,
    });
  }),
];

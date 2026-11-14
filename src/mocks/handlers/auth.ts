import { http, HttpResponse } from "msw";

export const authHandlers = [
  // ==========================================
  // 1. 인증 (Auth)
  // ==========================================
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: "존재하지 않는 계정" },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      resultCode: "200-1",
      data: {
        item: { id: 1, email: body.email, nickname: "손지수" },
        accessToken: "mock-access-token-12345",
      },
    });
  }),
  http.post("/api/auth/signup", async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      birthYear?: string;
    };
    if (!body.email || !body.password || !body.birthYear) {
      return HttpResponse.json(
        { message: "이메일/비밀번호/출생연도 누락" },
        { status: 400 }
      );
    }
    if (body.email === "duplicate@example.com") {
      return HttpResponse.json(
        { message: "이미 가입된 이메일" },
        { status: 409 }
      );
    }
    return HttpResponse.json({
      resultCode: "200-1",
      data: {
        item: { id: 1, email: body.email },
        accessToken: "mock-access-token-12345",
      },
    });
  }),
  http.post("/api/auth/logout", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post("/api/auth/refresh", () => {
    return HttpResponse.json({
      resultCode: "200-1",
      data: { accessToken: "new-mock-access-token-67890" },
    });
  }),
  http.post("/api/auth/guest-login", () => {
    return HttpResponse.json({
      resultCode: "200-1",
      data: {
        item: { id: 999, email: "guest@quoteme.com", nickname: "게스트" },
        accessToken: "mock-guest-access-token",
      },
    });
  }),
];

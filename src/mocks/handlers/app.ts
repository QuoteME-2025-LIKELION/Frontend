import { http, HttpResponse } from "msw";

export const appHandlers = [
  http.get("/api/app-version", () => {
    return HttpResponse.json({
      latestVersion: "1.0.0",
      updateNote: "버전 1.0.0 업데이트 내용",
    });
  }),
];

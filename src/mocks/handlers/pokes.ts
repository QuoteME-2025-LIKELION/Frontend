import { http, HttpResponse } from "msw";

export const pokesHandlers = [
  // ==========================================
  // 12. 콕 찌르기 (Pokes)
  // ==========================================
  http.post("/api/pokes/:receiverId", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get("/api/pokes/statistics", () => {
    return HttpResponse.json({ receivedCount: 3 });
  }),
];

import { http, HttpResponse } from "msw";

import { mockNotices } from "../state";

export const noticesHandlers = [
  // ==========================================
  // 10. 공지사항 (Notices)
  // ==========================================
  http.get("/api/notices", ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    return HttpResponse.json(
      type ? mockNotices.filter((notice) => notice.type === type) : mockNotices
    );
  }),
  http.get("/api/notices/:noticeId", ({ params }) => {
    const noticeId = Number(params.noticeId);
    const notice = mockNotices.find((item) => item.id === noticeId);
    if (!notice) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(notice);
  }),
];

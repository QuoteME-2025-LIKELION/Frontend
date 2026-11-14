import { http, HttpResponse } from "msw";

import {
  mockArchives,
  mockOwnArchives,
  mockLikedArchives,
  mockBookmarkedArchives,
} from "@/data/mock/archives";

import { mockArchiveBookmarkIds } from "../state";

export const archivesHandlers = [
  // ==========================================
  // 8. 아카이브 (Archive)
  // ==========================================
  http.get("/api/archives", ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const archives = mockArchives;
    return HttpResponse.json(
      date
        ? archives.filter((archive) => archive.createDate.startsWith(date))
        : archives
    );
  }),
  http.get("/api/archives/me", () => {
    return HttpResponse.json(mockOwnArchives);
  }),
  http.get("/api/archives/likes", () => {
    return HttpResponse.json(mockLikedArchives);
  }),
  http.get("/api/archives/bookmarks", ({ request }) => {
    const month = new URL(request.url).searchParams.get("month");
    if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return HttpResponse.json(
        { message: "월 형식을 확인해 주세요." },
        { status: 400 }
      );
    }
    const bookmarks = mockBookmarkedArchives;
    return HttpResponse.json(
      bookmarks.filter(
        (quote) =>
          mockArchiveBookmarkIds.has(quote.id) &&
          (!month || quote.createDate.slice(0, 7) === month)
      )
    );
  }),
];

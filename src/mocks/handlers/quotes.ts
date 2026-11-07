import { http, HttpResponse } from "msw";

import {
  mockGroups,
  getMockMember,
  mockFriendIds,
  mockQuoteTagRequestsByQuoteId,
  mockArchiveBookmarkIds,
  mockMyTagRequestStatusByQuoteId,
  mockAiUsage,
  getMockFeedQuotes,
  mockState,
} from "../state";

export const quotesHandlers = [
  // ==========================================
  // 5. 명언 & 피드 (Quotes)
  // ==========================================
  http.post("/api/quotes", async ({ request }) => {
    const body = (await request.json()) as {
      content: string;
      originalContent?: string | null;
      summary?: string | null;
      taggedMemberIds?: number[];
    };
    if (
      (body.taggedMemberIds ?? []).some(
        (id) => id === 1 || !mockFriendIds.includes(id)
      )
    ) {
      return HttpResponse.json(
        { message: "수락된 친구만 태그할 수 있습니다." },
        { status: 400 }
      );
    }
    const taggedMemberNames = (body.taggedMemberIds || [])
      .map((id) => getMockMember(id)?.nickname)
      .filter(Boolean);
    return HttpResponse.json(
      {
        id: Date.now(),
        content: body.content,
        originalContent: body.originalContent ?? null,
        summary: body.summary ?? null,
        authorName: null,
        authorBirthYear: 2000,
        taggedMemberNames,
        createDate: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),
  http.post("/api/quotes/summarize", () => {
    if (mockAiUsage.remaining <= 0) {
      return HttpResponse.json(
        {
          resultCode: "429-1",
          message: "AI 추천은 하루 1회까지만 사용할 수 있습니다.",
          data: {},
        },
        { status: 429 }
      );
    }
    mockAiUsage.used += 1;
    mockAiUsage.remaining = Math.max(mockAiUsage.limit - mockAiUsage.used, 0);
    return HttpResponse.json({
      summary: "오늘 못한 건 내일의 에너지로 남는다.",
      summaries: [
        "오늘 못한 건 내일의 에너지로 남는다.",
        "쉬어간 하루도 나를 앞으로 데려간다.",
        "오늘의 쉼은 내일의 시작이 된다.",
      ],
    });
  }),
  http.get("/api/quotes/ai-usage", () => {
    return HttpResponse.json(mockAiUsage);
  }),
  http.get("/api/quotes", ({ request }) => {
    const url = new URL(request.url);
    const groupId = url.searchParams.get("groupId");
    const otherQuotes = getMockFeedQuotes(groupId);
    const members =
      groupId === null
        ? []
        : (mockGroups.find((group) => group.id === Number(groupId))?.members ??
          []);
    const writtenMemberIds = new Set([1, 2, 3, 4, 6]);
    const unwrittenMembers = members
      .filter((member) => !writtenMemberIds.has(member.id))
      .map((member) => ({
        memberId: member.id,
        nickname: member.nickname,
        profileImage: member.profileImage,
      }));
    return HttpResponse.json({
      myQuotes: [
        {
          id: 1,
          content: "여자니까 이해해주길",
          groupName: "야매철학자들",
          authorNickname: "손지수",
          birthYear: "2000",
          originalContent: null,
          taggedNicknames: mockState.mockMyQuoteTags.map((tag) => tag.nickname),
          tags: mockState.mockMyQuoteTags,
          isBookmarked: mockState.mockMyQuoteIsBookmarked,
        },
      ],
      otherQuotes,
      unwrittenMembers,
    });
  }),
  http.get("/api/quotes/feed", ({ request }) => {
    const url = new URL(request.url);
    const items = getMockFeedQuotes(url.searchParams.get("groupId"));
    return HttpResponse.json({
      resultCode: "200",
      message: "200-1",
      data: {
        items,
        emptyMessage: items.length === 0 ? "표시할 명언이 없습니다." : null,
        empty: items.length === 0,
      },
      statusCode: 200,
    });
  }),
  http.post("/api/quotes/:quoteId/like", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete("/api/quotes/:quoteId/like", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  // ==========================================
  // 6. 태그 요청 (Tag Requests)
  // ==========================================
  http.patch("/api/quotes/:quoteId/tags", async ({ request }) => {
    const body = (await request.json()) as {
      taggedMemberIds?: number[];
    };
    if (
      (body.taggedMemberIds ?? []).some(
        (id) =>
          id === 1 ||
          (!mockFriendIds.includes(id) &&
            !mockState.mockMyQuoteTags.some((tag) => tag.memberId === id))
      )
    ) {
      return HttpResponse.json(
        { message: "새 태그는 수락된 친구만 가능합니다." },
        { status: 400 }
      );
    }
    mockState.mockMyQuoteTags = (body.taggedMemberIds ?? []).flatMap((id) => {
      const existing = mockState.mockMyQuoteTags.find(
        (tag) => tag.memberId === id
      );
      const member = getMockMember(id);
      return existing
        ? [existing]
        : member
          ? [
              {
                memberId: member.id,
                nickname: member.nickname,
                profileImage: member.profileImage,
              },
            ]
          : [];
    });
    return HttpResponse.json(body);
  }),
  ...(["accept", "reject"] as const).map((action) =>
    http.post(`/api/quotes/requests/:requestId/${action}`, ({ params }) => {
      const entry = Object.entries(mockQuoteTagRequestsByQuoteId).find(
        ([, requests]) =>
          requests.some(
            (request) => request.requestId === Number(params.requestId)
          )
      );
      if (!entry) return new HttpResponse(null, { status: 404 });
      const [quoteId, requests] = entry;
      const request = requests.find(
        (item) => item.requestId === Number(params.requestId)
      )!;
      if (
        action === "accept" &&
        Number(quoteId) === 1 &&
        !mockState.mockMyQuoteTags.some(
          (tag) => tag.memberId === request.requesterId
        )
      ) {
        mockState.mockMyQuoteTags.push({
          memberId: request.requesterId,
          nickname: request.requesterName,
          profileImage:
            getMockMember(request.requesterId)?.profileImage ?? null,
        });
      }
      mockQuoteTagRequestsByQuoteId[Number(quoteId)] = requests.filter(
        (item) => item.requestId !== request.requestId
      );
      return HttpResponse.json({
        resultCode: "200-1",
        message: "처리되었습니다.",
        data: null,
      });
    })
  ),
  http.post("/api/quotes/:quoteId/tag-request", ({ params }) => {
    const quoteId = Number(params.quoteId);
    const currentStatus = mockMyTagRequestStatusByQuoteId[quoteId];
    if (currentStatus === "PENDING" || currentStatus === "ACCEPTED") {
      return HttpResponse.json(
        { message: "이미 태그를 요청했습니다." },
        { status: 400 }
      );
    }
    mockMyTagRequestStatusByQuoteId[quoteId] = "PENDING";
    return new HttpResponse(null, { status: 201 });
  }),
  http.get("/api/quotes/:quoteId/my-tag-request", ({ params }) => {
    const quoteId = Number(params.quoteId);
    return HttpResponse.json({
      status: mockMyTagRequestStatusByQuoteId[quoteId] ?? "NONE",
    });
  }),
  http.get("/api/quotes/:quoteId/requests", ({ params }) => {
    const quoteId = Number(params.quoteId);
    return HttpResponse.json(mockQuoteTagRequestsByQuoteId[quoteId] ?? []);
  }),
  // ==========================================
  // 7. 북마크 (Bookmark)
  // ==========================================
  http.post("/api/quotes/:quoteId/bookmark", ({ params }) => {
    mockArchiveBookmarkIds.add(Number(params.quoteId));
    if (Number(params.quoteId) === 1) {
      mockState.mockMyQuoteIsBookmarked = true;
    }
    return HttpResponse.json(
      { resultCode: "201", message: "북마크에 추가되었습니다." },
      { status: 201 }
    );
  }),
  http.delete("/api/quotes/:quoteId/bookmark", ({ params }) => {
    mockArchiveBookmarkIds.delete(Number(params.quoteId));
    if (Number(params.quoteId) === 1) {
      mockState.mockMyQuoteIsBookmarked = false;
    }
    return new HttpResponse(null, { status: 200 });
  }),
];

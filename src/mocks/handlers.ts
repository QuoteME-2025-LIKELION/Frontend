import { http, HttpResponse } from "msw";

export const handlers = [
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
      accessToken: "new-mock-access-token-67890",
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

  // ==========================================
  // 2. 프로필 (Profile)
  // ==========================================
  http.get("/api/profile", () => {
    return HttpResponse.json({
      id: 1,
      nickname: "손지수",
      introduction: "긍정의 힘을 믿어요",
      profileImageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    });
  }),

  http.put("/api/profile", async () => {
    // multipart/form-data 처리
    return HttpResponse.json({
      id: 1,
      nickname: "수정된닉네임",
      introduction: "프로필이 수정되었습니다.",
      profileImageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    });
  }),

  http.get("/api/profile/account", () => {
    return HttpResponse.json({
      gender: "MALE",
      birthYear: 2000,
    });
  }),

  http.put("/api/profile/account", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
  }),

  http.delete("/api/profile/account", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get("/api/profile/:id", ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      nickname: `타인_${params.id}`,
      introduction: "타인 프로필 소개글입니다.",
      profileImageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    });
  }),

  // ==========================================
  // 3. 친구 (Friends)
  // ==========================================
  http.post("/api/friends/request/:targetId", ({ params }) => {
    if (params.targetId === "1") {
      return HttpResponse.json(
        {
          errorCode: "SELF_REQUEST",
          message: "자기 자신에게 요청할 수 없습니다.",
        },
        { status: 400 }
      );
    }
    return new HttpResponse(null, { status: 201 });
  }),

  http.get("/api/friends/requests", () => {
    return HttpResponse.json([
      {
        requestId: 10,
        requesterId: 5,
        requesterNickname: "라라진",
        requesterProfileImageUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        createdAt: "2025-11-07T10:00:00",
      },
    ]);
  }),

  http.post("/api/friends/requests/:requestId/accept", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/api/friends/requests/:requestId/reject", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.delete("/api/friends/:friendId", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // ==========================================
  // 4. 그룹 (Groups)
  // ==========================================
  http.post("/api/groups", async ({ request }) => {
    const body = (await request.json()) as { name?: string; motto?: string };
    return HttpResponse.json({
      id: 100,
      name: body.name || "신규 그룹",
      motto: body.motto || "오늘도 한 줄씩",
      memberCount: 1,
    });
  }),

  http.get("/api/groups/me", () => {
    return HttpResponse.json([
      { id: 1, name: "야매철학자들", motto: "오늘도 한 줄씩", memberCount: 3 },
      { id: 2, name: "무니니", motto: "화이팅", memberCount: 4 },
    ]);
  }),

  http.get("/api/groups/invitations", () => {
    return HttpResponse.json([
      {
        requestId: 1,
        groupId: 2,
        groupName: "무니니",
        inviterNickname: "라라진",
        createdAt: "2025-11-07T10:00:00",
      },
    ]);
  }),

  http.get("/api/groups/:groupId", ({ params }) => {
    return HttpResponse.json({
      id: Number(params.groupId),
      name: "야매철학자들",
      motto: "오늘도 한 줄씩",
      members: [
        { id: 1, nickname: "손지수", role: "LEADER" },
        { id: 2, nickname: "라라진", role: "MEMBER" },
      ],
    });
  }),

  http.delete("/api/groups/:groupId", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.patch("/api/groups/:groupId/motto", async ({ request }) => {
    const body = (await request.json()) as { motto: string };
    return HttpResponse.json({ motto: body.motto });
  }),

  http.post("/api/groups/:groupId/invite/:friendId", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/api/groups/invitations/:requestId/accept", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/api/groups/invitations/:requestId/reject", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/api/groups/:groupId/join-request", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get("/api/groups/:groupId/join-requests", () => {
    return HttpResponse.json([
      { requestId: 5, requesterId: 10, requesterNickname: "신규신청자" },
    ]);
  }),

  http.post("/api/groups/join-requests/:requestId/accept", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/api/groups/join-requests/:requestId/reject", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.delete("/api/groups/:groupId/members/:memberId", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // ==========================================
  // 5. 명언 & 피드 (Quotes)
  // ==========================================
  http.post("/api/quotes", async ({ request }) => {
    const body = (await request.json()) as {
      content: string;
      taggedMemberIds?: number[];
    };
    return HttpResponse.json(
      {
        quoteId: Date.now(),
        content: body.content,
        taggedMembers: (body.taggedMemberIds || []).map((id) => `멤버_${id}`),
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.post("/api/quotes/summarize", () => {
    return HttpResponse.json({
      summary: "오늘 못한 건 내일의 에너지로 남는다.",
    });
  }),

  http.get("/api/quotes/ai-usage", () => {
    return HttpResponse.json({
      usedCount: 1,
      remainingCount: 2,
      limitPerDay: 3,
    });
  }),

  http.get("/api/quotes", () => {
    return HttpResponse.json({
      myQuotes: [
        {
          quoteId: 1,
          content: "여자니까 이해해주길",
          originalContent: null,
          taggedMembers: ["뮤랄라", "스페이스"],
        },
      ],
      otherQuotes: [
        {
          quoteId: 2,
          authorNickname: "라라진",
          authorIntroduction: "Seize the day",
          content: "방귀 퀸 놈이 성낸다",
          taggedMembers: ["말랑이", "몰랑이", "규빈이"],
        },
      ],
    });
  }),

  http.get("/api/quotes/feed", () => {
    return HttpResponse.json({
      content: [
        {
          quoteId: 1,
          authorNickname: "라라진",
          content: "방귀 퀸 놈이 성낸다",
        },
      ],
      pageable: { pageNumber: 0, pageSize: 10 },
      last: true,
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
    const body = await request.json();
    return HttpResponse.json(body);
  }),

  http.post("/api/quotes/:quoteId/tag-request", () => {
    return new HttpResponse(null, { status: 201 });
  }),

  http.get("/api/quotes/:quoteId/my-tag-request", () => {
    return HttpResponse.json({ status: "PENDING" });
  }),

  http.get("/api/quotes/:quoteId/requests", () => {
    return HttpResponse.json([
      { requestId: 1, requesterNickname: "말랑이", status: "PENDING" },
    ]);
  }),

  http.post("/api/quotes/requests/:requestId/accept", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/api/quotes/requests/:requestId/reject", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // ==========================================
  // 7. 북마크 (Bookmark)
  // ==========================================
  http.post("/api/quotes/:quoteId/bookmark", () => {
    return HttpResponse.json(
      { resultCode: "201", message: "북마크에 추가되었습니다." },
      { status: 201 }
    );
  }),

  http.delete("/api/quotes/:quoteId/bookmark", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // ==========================================
  // 8. 아카이브 (Archive)
  // ==========================================
  http.get("/api/archives", () => {
    return HttpResponse.json([
      {
        quoteId: 1,
        content: "방귀 퀸 놈이 성낸다",
        originalContent: "오늘 말랑이랑 몰랑이랑 같이 카공을 했는데...",
        taggedMembers: ["말랑이", "몰랑이"],
        isBookmarked: true,
        isLiked: false,
        createdAt: "2025-10-31",
      },
    ]);
  }),

  http.get("/api/archives/me", () => {
    return HttpResponse.json([
      {
        quoteId: 1,
        content: "내 명언 예시",
        taggedMembers: [],
        isBookmarked: false,
        isLiked: true,
        createdAt: "2025-11-01",
      },
    ]);
  }),

  http.get("/api/archives/likes", () => {
    return HttpResponse.json([
      {
        quoteId: 2,
        content: "좋아요한 명언",
        taggedMembers: ["라라진"],
        isBookmarked: true,
        isLiked: true,
        createdAt: "2025-11-02",
      },
    ]);
  }),

  http.get("/api/archives/bookmarks", () => {
    return HttpResponse.json([
      {
        quoteId: 3,
        content: "북마크한 명언",
        taggedMembers: [],
        isBookmarked: true,
        isLiked: false,
        createdAt: "2025-11-03",
      },
    ]);
  }),

  // ==========================================
  // 9. 알림 (Notifications)
  // ==========================================
  http.get("/api/notifications", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    return HttpResponse.json([
      {
        id: 1,
        category: category || "GROUP",
        message: "무니니 그룹에서 초대가 왔습니다.",
        isRead: false,
        createdAt: "2025-11-07T10:00:00",
        referenceId: 3,
      },
    ]);
  }),

  http.get("/api/notifications/unread-count", () => {
    return HttpResponse.json({ count: 4 });
  }),

  http.patch("/api/notifications/:id/read", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get("/api/notifications/settings", () => {
    return HttpResponse.json({
      groupEnabled: true,
      friendEnabled: true,
      tagEnabled: true,
      pokeEnabled: false,
      likeEnabled: true,
      quoteReminderEnabled: true,
      marketingEnabled: false,
    });
  }),

  http.put("/api/notifications/settings", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
  }),

  // ==========================================
  // 10. 검색 & 친구목록 (Settings)
  // ==========================================
  http.get("/api/settings/search", ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") || "";

    return HttpResponse.json({
      members: [
        {
          id: 2,
          nickname: keyword ? `${keyword}_유저` : "라라진",
          introduction: "Seize the day",
          profileImageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        },
      ],
      groups: [{ id: 1, name: "무니니", memberCount: 3 }],
    });
  }),

  http.get("/api/settings/friends-list", () => {
    return HttpResponse.json([
      {
        friendId: 2,
        nickname: "라라진",
        introduction: "Seize the day",
        profileImageUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        isGroupMember: true,
      },
    ]);
  }),

  // ==========================================
  // 11. 콕 찌르기 (Pokes)
  // ==========================================
  http.post("/api/pokes/:receiverId", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get("/api/pokes/statistics", () => {
    return HttpResponse.json({ receivedCount: 3 });
  }),
];

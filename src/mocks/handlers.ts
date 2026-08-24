import { http, HttpResponse } from "msw";

const MOCK_PROFILE_IMAGE = "/favicons/favicon.svg";

const mockGroups = [
  {
    id: 1,
    name: "야매철학자들",
    motto: "오늘도 한 줄씩",
    memberCount: 3,
    leaderNickname: "손지수",
    members: [
      {
        id: 1,
        nickname: "손지수",
        role: "LEADER",
        introduction: "긍정의 힘을 믿어요",
        profileImage: MOCK_PROFILE_IMAGE,
      },
      {
        id: 2,
        nickname: "라라진",
        role: "MEMBER",
        introduction: "Seize the day",
        profileImage: MOCK_PROFILE_IMAGE,
      },
      {
        id: 3,
        nickname: "말랑이",
        role: "MEMBER",
        introduction: "천천히 단단하게",
        profileImage: MOCK_PROFILE_IMAGE,
      },
    ],
  },
  {
    id: 2,
    name: "무니니",
    motto: "화이팅",
    memberCount: 4,
    leaderNickname: "라라진",
    members: [
      {
        id: 1,
        nickname: "손지수",
        role: "MEMBER",
        introduction: "긍정의 힘을 믿어요",
        profileImage: MOCK_PROFILE_IMAGE,
      },
      {
        id: 2,
        nickname: "라라진",
        role: "LEADER",
        introduction: "Seize the day",
        profileImage: MOCK_PROFILE_IMAGE,
      },
      {
        id: 4,
        nickname: "몰랑이",
        role: "MEMBER",
        introduction: "좋은 문장을 모아요",
        profileImage: MOCK_PROFILE_IMAGE,
      },
      {
        id: 5,
        nickname: "규빈이",
        role: "MEMBER",
        introduction: "기록은 힘이 된다",
        profileImage: MOCK_PROFILE_IMAGE,
      },
    ],
  },
  {
    id: 3,
    name: "문장수집가",
    motto: "꽉 찬 마음으로",
    memberCount: 5,
    leaderNickname: "손지수",
    members: [
      {
        id: 1,
        nickname: "손지수",
        role: "LEADER",
        introduction: "긍정의 힘을 믿어요",
        profileImage: MOCK_PROFILE_IMAGE,
      },
      {
        id: 2,
        nickname: "라라진",
        role: "MEMBER",
        introduction: "Seize the day",
        profileImage: MOCK_PROFILE_IMAGE,
      },
      {
        id: 3,
        nickname: "말랑이",
        role: "MEMBER",
        introduction: "천천히 단단하게",
        profileImage: MOCK_PROFILE_IMAGE,
      },
      {
        id: 4,
        nickname: "몰랑이",
        role: "MEMBER",
        introduction: "좋은 문장을 모아요",
        profileImage: MOCK_PROFILE_IMAGE,
      },
      {
        id: 5,
        nickname: "규빈이",
        role: "MEMBER",
        introduction: "기록은 힘이 된다",
        profileImage: MOCK_PROFILE_IMAGE,
      },
    ],
  },
];

const searchableFriends = [
  {
    id: 6,
    nickname: "조니님",
    introduction: "새 친구를 기다려요",
    profileImage: MOCK_PROFILE_IMAGE,
  },
  {
    id: 7,
    nickname: "초대친구",
    introduction: "검색 결과 테스트",
    profileImage: MOCK_PROFILE_IMAGE,
  },
  {
    id: 8,
    nickname: "기록친구",
    introduction: "문장을 함께 모아요",
    profileImage: MOCK_PROFILE_IMAGE,
  },
];

const searchableGroups = [
  {
    id: 20,
    name: "무니니",
    motto: "같이 쓰는 오늘",
    memberCount: 3,
    leaderNickname: "조니님",
  },
  {
    id: 21,
    name: "멋쟁이 사자처럼",
    motto: "기록하는 사람들",
    memberCount: 4,
    leaderNickname: "검색친구",
  },
  {
    id: 22,
    name: "소이천 소이촌",
    motto: "좋은 말을 모아요",
    memberCount: 2,
    leaderNickname: "기록친구",
  },
];

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
      email: "guest@quoteme.com",
      introduction: "긍정의 힘을 믿어요",
      profileImageUrl: MOCK_PROFILE_IMAGE,
      profileImage: MOCK_PROFILE_IMAGE,
    });
  }),

  http.put("/api/profile", async () => {
    // multipart/form-data 처리
    return HttpResponse.json({
      id: 1,
      nickname: "수정된닉네임",
      email: "guest@quoteme.com",
      introduction: "프로필이 수정되었습니다.",
      profileImageUrl: MOCK_PROFILE_IMAGE,
      profileImage: MOCK_PROFILE_IMAGE,
    });
  }),

  http.get("/api/profile/account", () => {
    return HttpResponse.json({
      gender: "MALE",
      birthYear: 2000,
      email: "guest@quoteme.com",
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
      profileImageUrl: MOCK_PROFILE_IMAGE,
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
        requesterId: 6,
        requesterNickname: "조니님",
        requesterProfileImageUrl: MOCK_PROFILE_IMAGE,
        createdAt: "2025-11-07T10:00:00",
      },
      {
        requestId: 11,
        requesterId: 7,
        requesterNickname: "초대친구",
        requesterProfileImageUrl: MOCK_PROFILE_IMAGE,
        createdAt: "2025-11-07T10:05:00",
      },
      {
        requestId: 12,
        requesterId: 8,
        requesterNickname: "기록친구",
        requesterProfileImageUrl: MOCK_PROFILE_IMAGE,
        createdAt: "2025-11-07T10:10:00",
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
    return HttpResponse.json(
      mockGroups.map(({ id, name, motto, memberCount, leaderNickname }) => ({
        id,
        name,
        motto,
        memberCount,
        leaderNickname,
      }))
    );
  }),

  http.get("/api/groups/invitations", () => {
    return HttpResponse.json([
      {
        requestId: 1,
        groupId: 20,
        groupName: "무니니",
        inviterNickname: "라라진",
        createdAt: "2025-11-07T10:00:00",
      },
      {
        requestId: 2,
        groupId: 21,
        groupName: "멋쟁이 사자처럼",
        inviterNickname: "조니님",
        createdAt: "2025-11-07T10:05:00",
      },
    ]);
  }),

  http.get("/api/groups/:groupId", ({ params }) => {
    const group = mockGroups.find((item) => item.id === Number(params.groupId));

    if (!group) {
      return HttpResponse.json(
        { message: "존재하지 않는 그룹입니다." },
        { status: 500 }
      );
    }

    return HttpResponse.json(group);
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
      {
        requestId: 5,
        requesterId: 10,
        requesterNickname: "신규신청자",
        requesterProfileImageUrl: MOCK_PROFILE_IMAGE,
        createdAt: "2025-11-07T10:00:00",
      },
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
          id: 1,
          content: "여자니까 이해해주길",
          groupName: "야매철학자들",
          authorNickname: "손지수",
          birthYear: 2000,
          originalContent: null,
          taggedNicknames: ["뮤랄라", "스페이스"],
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

  http.get("/api/quotes/feed", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);

    return HttpResponse.json({
      content:
        page === 0
          ? [
              {
                quoteId: 1,
                authorNickname: "라라진",
                content: "방귀 퀸 놈이 성낸다",
              },
            ]
          : [],
      pageable: { pageNumber: page, pageSize: size },
      last: page >= 0,
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
        id: 1,
        content: "방귀 퀸 놈이 성낸다",
        originalContent: "오늘 말랑이랑 몰랑이랑 같이 카공을 했는데...",
        createDate: "2025-10-31",
        authorName: "라라진",
        authorBirthYear: 2000,
        taggedMemberNames: ["말랑이", "몰랑이"],
        isBookmarked: true,
        isLiked: false,
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
    const notificationCategory = category || "GROUP";

    return HttpResponse.json([
      {
        id: 1,
        category: notificationCategory,
        type: notificationCategory,
        message: "무니니 그룹에서 초대가 왔습니다.",
        isRead: false,
        createdAt: "2025-11-07T10:00:00",
        createDate: "2025-11-07T10:00:00",
        referenceId: 3,
        targetId: 3,
        senderName: "라라진",
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
  // 10. 공지사항 (Notices)
  // ==========================================
  http.get("/api/notices", ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "NOTICE";

    return HttpResponse.json([
      {
        noticeId: 1,
        type,
        title: "QuoteMe 서비스 업데이트 안내",
        createdAt: "2025-11-07T10:00:00",
      },
    ]);
  }),

  http.get("/api/notices/:noticeId", ({ params }) => {
    return HttpResponse.json({
      noticeId: Number(params.noticeId),
      type: "NOTICE",
      title: "QuoteMe 서비스 업데이트 안내",
      content: "신규 API 명세에 맞춘 기능이 순차적으로 적용됩니다.",
      createdAt: "2025-11-07T10:00:00",
    });
  }),

  // ==========================================
  // 11. 검색 & 친구목록 (Settings)
  // ==========================================
  http.get("/api/settings/search", ({ request }) => {
    const url = new URL(request.url);
    const keyword = (url.searchParams.get("keyword") || "").trim();
    const isEmptyScenario = ["없음", "empty", "no-result"].includes(
      keyword.toLowerCase()
    );
    const matchedMembers = searchableFriends.filter((friend) =>
      friend.nickname.includes(keyword)
    );
    const matchedGroups = searchableGroups.filter((group) =>
      group.name.includes(keyword)
    );

    return HttpResponse.json({
      members: isEmptyScenario
        ? []
        : matchedMembers.length > 0
          ? matchedMembers
          : searchableFriends,
      groups: isEmptyScenario
        ? []
        : matchedGroups.length > 0
          ? matchedGroups
          : searchableGroups,
    });
  }),

  http.get("/api/settings/friends-list", () => {
    return HttpResponse.json([
      {
        id: 2,
        nickname: "라라진",
        introduction: "Seize the day",
        profileImage: MOCK_PROFILE_IMAGE,
        groupMember: true,
      },
      {
        id: 6,
        nickname: "초대친구",
        introduction: "새 그룹을 기다려요",
        profileImage: MOCK_PROFILE_IMAGE,
        groupMember: false,
      },
      {
        id: 7,
        nickname: "검색친구",
        introduction: "검색 결과 테스트",
        profileImage: MOCK_PROFILE_IMAGE,
        groupMember: false,
      },
    ]);
  }),

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

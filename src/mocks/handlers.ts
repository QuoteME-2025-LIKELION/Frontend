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

const mockMembersById = {
  2: {
    id: 2,
    nickname: "라라진",
    introduction: "Seize the day",
    profileImage: MOCK_PROFILE_IMAGE,
  },
  6: {
    id: 6,
    nickname: "조니님",
    introduction: "새 친구를 기다려요",
    profileImage: MOCK_PROFILE_IMAGE,
  },
  7: {
    id: 7,
    nickname: "초대친구",
    introduction: "검색 결과 테스트",
    profileImage: MOCK_PROFILE_IMAGE,
  },
  8: {
    id: 8,
    nickname: "기록친구",
    introduction: "문장을 함께 모아요",
    profileImage: MOCK_PROFILE_IMAGE,
  },
};

const searchableFriends = [
  mockMembersById[6],
  mockMembersById[7],
  mockMembersById[8],
];

const friendsListGroupMemberById = {
  2: true,
  6: false,
  7: false,
};

const mockFriendRequestIds = [6, 7, 8];

const getMockMember = (id: number) =>
  mockMembersById[id as keyof typeof mockMembersById];

const createFriendRequest = (requesterId: number, index: number) => {
  const member = getMockMember(requesterId);

  return {
    requestId: 10 + index,
    requesterId,
    requesterNickname: member.nickname,
    requesterProfileImageUrl: member.profileImage,
    createdAt: `2025-11-07T10:${String(index * 5).padStart(2, "0")}:00`,
  };
};

const createFriendListItem = (id: number) => ({
  ...getMockMember(id),
  groupMember:
    friendsListGroupMemberById[id as keyof typeof friendsListGroupMemberById],
});

const mockQuoteTagRequestsByQuoteId: Record<
  number,
  Array<{
    requestId: number;
    requesterNickname: string;
    status: "NONE" | "PENDING" | "ACCEPTED" | "REJECTED";
  }>
> = {
  1: [{ requestId: 101, requesterNickname: "라라진", status: "PENDING" }],
};

const mockMyTagRequestStatusByQuoteId: Record<
  number,
  "NONE" | "PENDING" | "ACCEPTED" | "REJECTED"
> = {};

const findQuoteTagRequest = (requestId: number) => {
  for (const [quoteId, requests] of Object.entries(
    mockQuoteTagRequestsByQuoteId
  )) {
    const request = requests.find((item) => item.requestId === requestId);

    if (request) {
      return { quoteId: Number(quoteId), request };
    }
  }

  return null;
};

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

type MockGroupJoinRequest = {
  requestId: number;
  requesterId: number;
  requesterNickname: string;
  requesterProfileImageUrl?: string;
  createdAt: string;
};

const mockGroupJoinRequestsByGroupId: Record<number, MockGroupJoinRequest[]> = {
  1: [
    {
      requestId: 5,
      requesterId: 10,
      requesterNickname: "신규신청자",
      requesterProfileImageUrl: MOCK_PROFILE_IMAGE,
      createdAt: "2025-11-07T10:00:00",
    },
  ],
  3: [
    {
      requestId: 6,
      requesterId: 11,
      requesterNickname: "정원확인",
      requesterProfileImageUrl: MOCK_PROFILE_IMAGE,
      createdAt: "2025-11-07T10:10:00",
    },
  ],
};

const findGroupJoinRequest = (requestId: number) => {
  for (const [groupId, requests] of Object.entries(
    mockGroupJoinRequestsByGroupId
  )) {
    const requestIndex = requests.findIndex(
      (requestItem) => requestItem.requestId === requestId
    );

    if (requestIndex >= 0) {
      return {
        groupId: Number(groupId),
        requestIndex,
        request: requests[requestIndex],
      };
    }
  }

  return null;
};

const mockAiUsage = {
  usedCount: 1,
  remainingCount: 2,
  limitPerDay: 3,
};

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
    return HttpResponse.json(
      mockFriendRequestIds.map((id, index) => createFriendRequest(id, index))
    );
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
        groupId: 2,
        groupName: "무니니",
        inviterNickname: "라라진",
        createdAt: "2025-11-07T10:00:00",
      },
      {
        requestId: 2,
        groupId: 3,
        groupName: "문장수집가",
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
        { status: 404 }
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

  http.get("/api/groups/:groupId/join-requests", ({ params }) => {
    const groupId = Number(params.groupId);

    return HttpResponse.json(mockGroupJoinRequestsByGroupId[groupId] ?? []);
  }),

  http.post("/api/groups/join-requests/:requestId/accept", ({ params }) => {
    const requestId = Number(params.requestId);
    const joinRequest = findGroupJoinRequest(requestId);

    if (!joinRequest) {
      return HttpResponse.json(
        { message: "존재하지 않는 가입 요청입니다." },
        { status: 404 }
      );
    }

    const group = mockGroups.find((item) => item.id === joinRequest.groupId);

    if (!group) {
      return HttpResponse.json(
        { message: "존재하지 않는 그룹입니다." },
        { status: 404 }
      );
    }

    if (group.members.length >= 5) {
      return HttpResponse.json(
        { message: "그룹 정원이 가득 찼습니다." },
        { status: 400 }
      );
    }

    group.members.push({
      id: joinRequest.request.requesterId,
      nickname: joinRequest.request.requesterNickname,
      role: "MEMBER",
      introduction: "그룹 가입 요청으로 합류했어요",
      profileImage: joinRequest.request.requesterProfileImageUrl ?? "",
    });
    group.memberCount = group.members.length;
    mockGroupJoinRequestsByGroupId[joinRequest.groupId].splice(
      joinRequest.requestIndex,
      1
    );

    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/api/groups/join-requests/:requestId/reject", ({ params }) => {
    const requestId = Number(params.requestId);
    const joinRequest = findGroupJoinRequest(requestId);

    if (!joinRequest) {
      return HttpResponse.json(
        { message: "존재하지 않는 가입 요청입니다." },
        { status: 404 }
      );
    }

    mockGroupJoinRequestsByGroupId[joinRequest.groupId].splice(
      joinRequest.requestIndex,
      1
    );

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
    if (mockAiUsage.remainingCount <= 0) {
      return HttpResponse.json(
        { message: "하루 AI 추천 사용량을 초과했습니다." },
        { status: 429 }
      );
    }

    mockAiUsage.usedCount += 1;
    mockAiUsage.remainingCount = Math.max(
      mockAiUsage.limitPerDay - mockAiUsage.usedCount,
      0
    );

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
          id: 2,
          quoteId: 2,
          authorNickname: "라라진",
          authorIntroduction: "Seize the day",
          content: "방귀 퀸 놈이 성낸다",
          taggedNicknames: ["말랑이", "몰랑이", "규빈이"],
          taggedMembers: ["말랑이", "몰랑이", "규빈이"],
          isLiked: false,
          isBookmarked: false,
          isFriendQuote: true,
          timeAgo: "19시간 전",
          createDate: "2025-11-03T19:02:00",
        },
        {
          id: 3,
          quoteId: 3,
          authorNickname: "조니님",
          authorIntroduction: "새 친구를 기다려요",
          authorProfileImage: MOCK_PROFILE_IMAGE,
          content: "내일의 나는 오늘의 기록에서 시작된다",
          taggedNicknames: [],
          taggedMembers: [],
          isLiked: false,
          isBookmarked: false,
          isFriendQuote: true,
          timeAgo: "1시간 전",
          createDate: "2025-11-03T19:02:00",
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

  http.post("/api/quotes/:quoteId/tag-request", ({ params }) => {
    const quoteId = Number(params.quoteId);

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

  http.post("/api/quotes/requests/:requestId/accept", ({ params }) => {
    const request = findQuoteTagRequest(Number(params.requestId));

    if (!request) {
      return HttpResponse.json(
        { message: "존재하지 않는 태그 요청입니다." },
        { status: 404 }
      );
    }

    request.request.status = "ACCEPTED";

    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/api/quotes/requests/:requestId/reject", ({ params }) => {
    const request = findQuoteTagRequest(Number(params.requestId));

    if (!request) {
      return HttpResponse.json(
        { message: "존재하지 않는 태그 요청입니다." },
        { status: 404 }
      );
    }

    request.request.status = "REJECTED";

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
  http.get("/api/archives", ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const archives = [
      {
        id: 1,
        content: "방귀 퀸 놈이 성낸다",
        originalContent:
          "사용자가 적은 원문이 보이는 자리 사용자가 적은 원문이 보이는 자리",
        createDate: "2025-10-31",
        authorName: "라라진",
        authorBirthYear: 1999,
        taggedMemberNames: ["말랑이", "몰랑이"],
        isBookmarked: true,
        isLiked: false,
      },
      {
        id: 2,
        content: "방귀 뀐 놈이 성낸다",
        originalContent:
          "사용자가 적은 원문이 보이는 자리 사용자가 적은 원문이 보이는 자리",
        createDate: "2025-11-07",
        authorName: "닉네임",
        authorBirthYear: 1999,
        taggedMemberNames: ["라라진", "말랑이", "물렁이"],
        isBookmarked: true,
        isLiked: true,
      },
      {
        id: 3,
        content: "오늘의 마음은 오늘 정리한다",
        originalContent:
          "오늘 있었던 일을 바탕으로 나만의 문장을 남겨두었습니다.",
        createDate: "2025-11-07",
        authorName: "몰랑이",
        authorBirthYear: 1999,
        taggedMemberNames: ["라라진"],
        isBookmarked: false,
        isLiked: false,
      },
    ];

    return HttpResponse.json(
      date
        ? archives.filter((archive) => archive.createDate.startsWith(date))
        : archives
    );
  }),

  http.get("/api/archives/me", () => {
    return HttpResponse.json([
      {
        id: 4,
        quoteId: 4,
        content: "방귀 뀐 놈이 성낸다",
        originalContent:
          "사용자가 적은 원문이 보이는 자리 사용자가 적은 원문이 보이는 자리사용자가 적은 원문이 보이는 자리",
        createDate: "2025-11-02",
        createdAt: "2025-11-02",
        authorName: "닉네임",
        authorNickname: "닉네임",
        authorBirthYear: 1999,
        taggedMemberNames: ["라라진", "말랑이", "물렁이"],
        taggedMembers: ["라라진", "말랑이", "물렁이"],
        isBookmarked: false,
        isLiked: true,
      },
    ]);
  }),

  http.get("/api/archives/likes", () => {
    return HttpResponse.json([
      {
        id: 5,
        quoteId: 5,
        content: "방귀 뀐 놈이 성낸다",
        originalContent:
          "사용자가 적은 원문이 보이는 자리 사용자가 적은 원문이 보이는 자리",
        createDate: "2025-11-03",
        createdAt: "2025-11-03",
        authorName: "닉네임",
        authorNickname: "닉네임",
        authorBirthYear: 1999,
        taggedMemberNames: ["라라진", "말랑이", "물렁이"],
        taggedMembers: ["라라진", "말랑이", "물렁이"],
        isBookmarked: true,
        isLiked: true,
      },
    ]);
  }),

  http.get("/api/archives/bookmarks", () => {
    return HttpResponse.json([
      {
        id: 6,
        quoteId: 6,
        content: "오늘의 마음은 오늘 정리한다",
        originalContent:
          "오늘 있었던 일을 바탕으로 나만의 문장을 남겨두었습니다.",
        createDate: "2025-11-04",
        createdAt: "2025-11-04",
        authorName: "라라진",
        authorNickname: "라라진",
        authorBirthYear: 1999,
        taggedMemberNames: ["말랑이"],
        taggedMembers: ["말랑이"],
        isBookmarked: true,
        isLiked: false,
      },
    ]);
  }),

  // ==========================================
  // 9. 알림 (Notifications)
  // ==========================================
  http.get("/api/notifications", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const notifications = [
      {
        id: 1,
        category: "GROUP",
        type: "GROUP",
        message: "무니니 그룹에서 초대가 왔습니다.",
        isRead: false,
        createdAt: "2025-11-07T10:00:00",
        createDate: "2025-11-07T10:00:00",
        referenceId: 3,
        targetId: 3,
        senderName: "라라진",
      },
      {
        id: 2,
        category: "TAG",
        type: "TAG_REQUEST",
        message: "라라진님이 태그를 요청하였습니다.",
        isRead: false,
        createdAt: "2025-11-07T10:10:00",
        createDate: "2025-11-03T19:02:00",
        referenceId: 1,
        targetId: 1,
        senderName: "라라진",
      },
      {
        id: 3,
        category: "POKE",
        type: "POKE",
        message: "조니님이 콕 찔렀습니다.",
        isRead: true,
        createdAt: "2025-11-07T10:20:00",
        createDate: "2025-11-07T10:20:00",
        referenceId: 6,
        targetId: 6,
        senderName: "조니님",
      },
    ];

    return HttpResponse.json(
      category
        ? notifications.filter(
            (notification) =>
              notification.type === category || notification.category === category
          )
        : notifications
    );
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
    return HttpResponse.json([2, 6, 7].map(createFriendListItem));
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

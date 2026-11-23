import { http, HttpResponse } from "msw";

import {
  mockGroups,
  mockSentInvitationsByGroupId,
  getMockMember,
  mockFriendIds,
  searchableGroups,
  mockSentJoinRequests,
  mockGroupJoinRequestsByGroupId,
  findGroupJoinRequest,
  mockGroupInvitations,
  mockState,
} from "../state";

// MSW는 현재 로그인 회원(id=1)의 단일 계정 시나리오를 사용한다.
function leaderGroup(groupId: number) {
  const group = mockGroups.find((item) => item.id === groupId);
  if (!group)
    return HttpResponse.json(
      { message: "그룹을 찾을 수 없습니다." },
      { status: 404 }
    );
  if (
    !group.members.some((member) => member.id === 1 && member.role === "LEADER")
  ) {
    return HttpResponse.json({ message: "권한이 없습니다." }, { status: 403 });
  }
  return group;
}

export const groupsHandlers = [
  // ==========================================
  // 4. 그룹 (Groups)
  // ==========================================
  http.post("/api/groups", async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      motto?: string;
    };
    return HttpResponse.json({
      id: 100,
      name: body.name || "신규 그룹",
      motto: body.motto || "오늘도 한 줄씩",
      memberCount: 1,
    });
  }),
  http.get("/api/groups/me", () => {
    return HttpResponse.json(mockGroups);
  }),
  http.get("/api/groups/invitations", () => {
    return HttpResponse.json(mockGroupInvitations);
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
    const body = (await request.json()) as {
      motto: string;
    };
    return HttpResponse.json({ motto: body.motto });
  }),
  http.post("/api/groups/:groupId/invite/:friendId", ({ params }) => {
    const groupId = Number(params.groupId);
    const group = leaderGroup(groupId);
    if (group instanceof Response) return group;
    const friendId = Number(params.friendId);
    const friend = getMockMember(friendId);
    if (!friend) return new HttpResponse(null, { status: 404 });
    if (!mockFriendIds.includes(friendId))
      return new HttpResponse(null, { status: 400 });
    if (group.members.length >= 5)
      return new HttpResponse(null, { status: 400 });
    if (group.members.some((member) => member.id === friendId))
      return new HttpResponse(null, { status: 400 });
    const invitations = (mockSentInvitationsByGroupId[groupId] ??= []);
    if (invitations.some((item) => item.requesterId === friendId))
      return new HttpResponse(null, { status: 400 });
    invitations.push({
      requestId: mockState.nextSentInvitationId++,
      requesterId: friend.id,
      requesterNickname: friend.nickname,
      requesterProfileImage: friend.profileImage,
      requesterIntroduction: friend.introduction,
    });
    return new HttpResponse(null, { status: 200 });
  }),
  http.get("/api/groups/:groupId/invitations/sent", ({ params }) => {
    const groupId = Number(params.groupId);
    const group = leaderGroup(groupId);
    if (group instanceof Response) return group;
    return HttpResponse.json(mockSentInvitationsByGroupId[groupId] ?? []);
  }),
  http.delete("/api/groups/:groupId/invitations/:requestId", ({ params }) => {
    const groupId = Number(params.groupId);
    const group = leaderGroup(groupId);
    if (group instanceof Response) return group;
    const invitations = mockSentInvitationsByGroupId[groupId] ?? [];
    const index = invitations.findIndex(
      (item) => item.requestId === Number(params.requestId)
    );
    if (index < 0) return new HttpResponse(null, { status: 404 });
    invitations.splice(index, 1);
    return HttpResponse.json({
      resultCode: "200",
      message: "그룹 초대를 취소했습니다.",
      data: null,
    });
  }),
  http.post("/api/groups/invitations/:requestId/accept", ({ params }) => {
    const invitation = mockGroupInvitations.find(
      (item) => item.requestId === Number(params.requestId)
    );
    const group = mockGroups.find((item) => item.id === invitation?.groupId);
    if (group && group.members.length >= 5) {
      return HttpResponse.json(
        {
          resultCode: "400",
          message: "400-1 - 최대 인원 5명이 가득 차 들어갈 수 없어요",
          data: null,
          statusCode: 400,
        },
        { status: 400 }
      );
    }
    return new HttpResponse(null, { status: 200 });
  }),
  http.post("/api/groups/invitations/:requestId/reject", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post("/api/groups/:groupId/join-request", ({ params }) => {
    const groupId = Number(params.groupId);
    const group = searchableGroups.find((item) => item.id === groupId);
    if (mockGroups.some((item) => item.id === groupId)) {
      return HttpResponse.json(
        { message: "이미 가입한 그룹입니다." },
        { status: 400 }
      );
    }
    if (!group) return new HttpResponse(null, { status: 404 });
    if (mockSentJoinRequests.some((item) => item.groupId === groupId)) {
      return HttpResponse.json(
        { resultCode: "400", message: "400-4 - 이미 가입 승인 대기 중입니다." },
        { status: 400 }
      );
    }
    mockSentJoinRequests.unshift({
      requestId: mockState.nextSentJoinRequestId++,
      groupId,
      groupName: group.name,
      requestedAt: new Date().toISOString(),
    });
    return HttpResponse.json({
      resultCode: "200-1",
      message: "가입을 요청했습니다.",
      data: null,
    });
  }),
  http.get("/api/groups/join-requests/sent", () => {
    return HttpResponse.json(mockSentJoinRequests);
  }),
  http.delete("/api/groups/join-requests/:requestId", ({ params }) => {
    const requestId = Number(params.requestId);
    const index = mockSentJoinRequests.findIndex(
      (item) => item.requestId === requestId
    );
    if (index < 0) {
      const isOtherRequest = findGroupJoinRequest(requestId) !== null;
      return HttpResponse.json(
        {
          message: isOtherRequest
            ? "권한이 없습니다."
            : "요청을 찾을 수 없습니다.",
        },
        { status: isOtherRequest ? 403 : 404 }
      );
    }
    mockSentJoinRequests.splice(index, 1);
    return HttpResponse.json({
      resultCode: "200-1",
      message: "가입 신청이 취소되었습니다.",
      data: null,
    });
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
      profileImage: joinRequest.request.requesterProfileImage ?? "",
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
];

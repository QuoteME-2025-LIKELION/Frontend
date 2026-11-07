import { http, HttpResponse } from "msw";

import {
  MOCK_PROFILE_IMAGE,
  getMockMember,
  mockFriendIds,
  mockState,
} from "../state";

export const friendsHandlers = [
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
    const receiverId = Number(params.targetId);
    const member = getMockMember(receiverId);
    if (!member) return new HttpResponse(null, { status: 404 });
    if (
      mockState.mockFriendRequests.some((item) =>
        item.direction === "SENT"
          ? item.receiverId === receiverId
          : item.senderId === receiverId
      )
    ) {
      return HttpResponse.json(
        { message: "이미 대기 중인 친구 요청이 있습니다." },
        { status: 400 }
      );
    }
    mockState.mockFriendRequests.push({
      requestId: mockState.nextFriendRequestId++,
      direction: "SENT",
      senderId: 1,
      senderNickname: "손지수",
      senderProfileImage: MOCK_PROFILE_IMAGE,
      receiverId,
      receiverNickname: member.nickname,
      receiverProfileImage: member.profileImage,
      receiverIntroduction: member.introduction,
    });
    return new HttpResponse(null, { status: 201 });
  }),
  http.get("/api/friends/requests", () => {
    return HttpResponse.json(mockState.mockFriendRequests);
  }),
  http.delete("/api/friends/request/:receiverId", ({ params }) => {
    const receiverId = Number(params.receiverId);
    const index = mockState.mockFriendRequests.findIndex(
      (item) => item.direction === "SENT" && item.receiverId === receiverId
    );
    if (index < 0) {
      const isReceived = mockState.mockFriendRequests.some(
        (item) => item.direction === "RECEIVED" && item.senderId === receiverId
      );
      return HttpResponse.json(
        {
          message: isReceived
            ? "내가 보낸 요청만 취소할 수 있습니다."
            : "요청을 찾을 수 없습니다.",
        },
        { status: isReceived ? 403 : 404 }
      );
    }
    mockState.mockFriendRequests.splice(index, 1);
    return HttpResponse.json({
      resultCode: "200-1",
      message: "친구 요청이 취소되었습니다.",
      data: null,
    });
  }),
  http.post("/api/friends/requests/:requestId/accept", ({ params }) => {
    const item = mockState.mockFriendRequests.find(
      (request) =>
        request.requestId === Number(params.requestId) &&
        request.direction !== "SENT"
    );
    if (!item) return new HttpResponse(null, { status: 404 });
    if (!mockFriendIds.includes(item.senderId))
      mockFriendIds.push(item.senderId);
    mockState.mockFriendRequests = mockState.mockFriendRequests.filter(
      (request) => request.requestId !== item.requestId
    );
    return new HttpResponse(null, { status: 200 });
  }),
  http.post("/api/friends/requests/:requestId/reject", ({ params }) => {
    const item = mockState.mockFriendRequests.find(
      (request) =>
        request.requestId === Number(params.requestId) &&
        request.direction !== "SENT"
    );
    if (!item) return new HttpResponse(null, { status: 404 });
    mockState.mockFriendRequests = mockState.mockFriendRequests.filter(
      (request) => request.requestId !== item.requestId
    );
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete("/api/friends/:friendId", () => {
    return new HttpResponse(null, { status: 200 });
  }),
];

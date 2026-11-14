import type { GroupJoinRequest, GroupJoinRequestSent } from "@/api/groupApi";
import type { MockGroupJoinRequest } from "@/types/mock.type";

import { MOCK_PROFILE_IMAGE } from "./profile";

export const mockGroups = [
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

export const friendsListGroupMemberById = {
  2: true,
  6: false,
  7: false,
};

export const searchableGroups = [
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

export const mockSentJoinRequests: GroupJoinRequestSent[] = [];

export const mockGroupJoinRequestsByGroupId: Record<
  number,
  MockGroupJoinRequest[]
> = {
  1: [
    {
      requestId: 5,
      requesterId: 10,
      requesterNickname: "신규신청자",
      requesterProfileImage: MOCK_PROFILE_IMAGE,
      createdAt: "2025-11-07T10:00:00",
    },
  ],
  3: [
    {
      requestId: 6,
      requesterId: 11,
      requesterNickname: "정원확인",
      requesterProfileImage: MOCK_PROFILE_IMAGE,
      createdAt: "2025-11-07T10:10:00",
    },
  ],
};

export const mockGroupInvitations = [
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
];

export const nextSentJoinRequestId = 100;

export const mockSentInvitationsByGroupId: Record<number, GroupJoinRequest[]> =
  {
    1: [
      {
        requestId: 201,
        requesterId: 6,
        requesterNickname: "조니님",
        requesterIntroduction: "새 친구를 기다려요",
        requesterProfileImage: MOCK_PROFILE_IMAGE,
      },
    ],
  };

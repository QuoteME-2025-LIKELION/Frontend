import { MOCK_PROFILE_IMAGE } from "./profile";

export const mockMembersById = {
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

export const searchableFriends = [
  mockMembersById[6],
  mockMembersById[7],
  mockMembersById[8],
];

export const mockFriendRequestIds = [6, 7, 8];

export const mockFriendIds = [2, 6, 7];

export const nextFriendRequestId = 20;

import type { FriendRequest } from "@/api/friendApi";
import type { AccountProfileResponse } from "@/api/profileApi";
import {
  mockMembersById as mockMembersByIdSeed,
  searchableFriends as searchableFriendsSeed,
  mockFriendRequestIds as mockFriendRequestIdsSeed,
  mockFriendIds as mockFriendIdsSeed,
  nextFriendRequestId as nextFriendRequestIdSeed,
} from "@/data/mock/friends";
import {
  mockGroups as mockGroupsSeed,
  friendsListGroupMemberById as friendsListGroupMemberByIdSeed,
  searchableGroups as searchableGroupsSeed,
  mockSentJoinRequests as mockSentJoinRequestsSeed,
  mockGroupJoinRequestsByGroupId as mockGroupJoinRequestsByGroupIdSeed,
  mockGroupInvitations as mockGroupInvitationsSeed,
  nextSentJoinRequestId as nextSentJoinRequestIdSeed,
} from "@/data/mock/groups";
import { mockNotices as mockNoticesSeed } from "@/data/mock/notices";
import {
  mockNotificationSettings as mockNotificationSettingsSeed,
  mockNotifications as mockNotificationsSeed,
} from "@/data/mock/notifications";
import {
  MOCK_PROFILE_IMAGE as MOCK_PROFILE_IMAGESeed,
  mockAccountInfo as mockAccountInfoSeed,
} from "@/data/mock/profile";
import {
  mockFeedQuotes,
  mockQuoteTagRequestsByQuoteId as mockQuoteTagRequestsByQuoteIdSeed,
  mockArchiveBookmarkIds as mockArchiveBookmarkIdsSeed,
  mockMyTagRequestStatusByQuoteId as mockMyTagRequestStatusByQuoteIdSeed,
  mockAiUsage as mockAiUsageSeed,
  mockMyQuoteTags as mockMyQuoteTagsSeed,
  mockMyQuoteIsBookmarked as mockMyQuoteIsBookmarkedSeed,
} from "@/data/mock/quotes";
import type { QuoteTag } from "@/types/feed.type";
import type { MockNotification } from "@/types/mock.type";

export const MOCK_PROFILE_IMAGE = structuredClone(MOCK_PROFILE_IMAGESeed);

export const mockNotices = structuredClone(mockNoticesSeed);

export const mockGroups = structuredClone(mockGroupsSeed);

export const mockMembersById = structuredClone(mockMembersByIdSeed);

export const searchableFriends = structuredClone(searchableFriendsSeed);

export const friendsListGroupMemberById = structuredClone(
  friendsListGroupMemberByIdSeed
);

export const mockFriendRequestIds = structuredClone(mockFriendRequestIdsSeed);

export const getMockMember = (id: number) =>
  mockMembersById[id as keyof typeof mockMembersById];

export const createFriendRequest = (
  senderId: number,
  index: number
): FriendRequest => {
  const member = getMockMember(senderId);
  return {
    requestId: 10 + index,
    direction: "RECEIVED",
    senderId,
    senderNickname: member.nickname,
    senderProfileImage: member.profileImage,
    senderIntroduction: member.introduction,
    receiverId: 1,
    receiverNickname: "손지수",
    receiverProfileImage: MOCK_PROFILE_IMAGE,
  };
};

export const mockFriendIds = structuredClone(mockFriendIdsSeed);

export const createFriendListItem = (id: number) => ({
  ...getMockMember(id),
  groupMember:
    friendsListGroupMemberById[id as keyof typeof friendsListGroupMemberById],
});

export const mockQuoteTagRequestsByQuoteId = structuredClone(
  mockQuoteTagRequestsByQuoteIdSeed
);

export const mockArchiveBookmarkIds = structuredClone(
  mockArchiveBookmarkIdsSeed
);

export const mockMyTagRequestStatusByQuoteId = structuredClone(
  mockMyTagRequestStatusByQuoteIdSeed
);

export const searchableGroups = structuredClone(searchableGroupsSeed);

export const mockSentJoinRequests = structuredClone(mockSentJoinRequestsSeed);

export const mockGroupJoinRequestsByGroupId = structuredClone(
  mockGroupJoinRequestsByGroupIdSeed
);

export const findGroupJoinRequest = (requestId: number) => {
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

export const mockAiUsage = structuredClone(mockAiUsageSeed);

export function getMockFeedQuotes(groupIdParam: string | null) {
  const groupId = groupIdParam === null ? undefined : Number(groupIdParam);
  const groupMemberNicknames =
    groupId === undefined
      ? [2, 6, 7].map((id) => getMockMember(id).nickname)
      : (mockGroups
          .find((group) => group.id === groupId)
          ?.members.map((member) => member.nickname) ?? []);
  return mockFeedQuotes
    .filter((quote) => groupMemberNicknames.includes(quote.authorNickname))
    .map((quote) => ({
      ...quote,
      tags: quote.taggedNicknames.map((nickname, index) => ({
        memberId:
          Object.values(mockMembersById).find(
            (member) => member.nickname === nickname
          )?.id ?? 100 + index,
        nickname,
        profileImage: MOCK_PROFILE_IMAGE,
      })),
      myTagStatus:
        mockMyTagRequestStatusByQuoteId[quote.id] === "PENDING"
          ? "REQUESTED"
          : "NONE",
    }));
}

export const mockGroupInvitations = structuredClone(mockGroupInvitationsSeed);

export const mockState = {
  mockAccountInfo: structuredClone(
    mockAccountInfoSeed
  ) as AccountProfileResponse,
  mockNotificationSettings: structuredClone(mockNotificationSettingsSeed),
  mockNotifications: structuredClone(
    mockNotificationsSeed
  ) as MockNotification[],
  mockFriendRequests: mockFriendRequestIds.map(createFriendRequest),
  nextFriendRequestId: structuredClone(nextFriendRequestIdSeed),
  mockMyQuoteTags: structuredClone(mockMyQuoteTagsSeed) as QuoteTag[],
  mockMyQuoteIsBookmarked: structuredClone(mockMyQuoteIsBookmarkedSeed),
  nextSentJoinRequestId: structuredClone(nextSentJoinRequestIdSeed),
};

import type { QuoteTag } from "@/types/feed.type";

import { MOCK_PROFILE_IMAGE } from "./profile";

export const mockQuoteTagRequestsByQuoteId: Record<
  number,
  Array<{
    requestId: number;
    requesterId: number;
    requesterName: string;
  }>
> = {
  1: [
    { requestId: 101, requesterId: 2, requesterName: "라라진" },
    { requestId: 102, requesterId: 8, requesterName: "기록친구" },
  ],
};

export const mockArchiveBookmarkIds = new Set([6]);

export const mockMyTagRequestStatusByQuoteId: Record<
  number,
  "NONE" | "PENDING" | "ACCEPTED" | "REJECTED"
> = {};

export const mockAiUsage = {
  used: 0,
  remaining: 1,
  limit: 1,
};

export const mockMyQuoteTags: QuoteTag[] = [
  { memberId: 91, nickname: "뮤랄라", profileImage: MOCK_PROFILE_IMAGE },
  { memberId: 92, nickname: "스페이스", profileImage: MOCK_PROFILE_IMAGE },
];

export const mockMyQuoteIsBookmarked = false;

export const mockFeedQuotes = [
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
  {
    id: 4,
    quoteId: 4,
    authorNickname: "말랑이",
    authorIntroduction: "천천히 단단하게",
    authorProfileImage: MOCK_PROFILE_IMAGE,
    content: "느린 걸음도 방향이 있으면 충분하다",
    taggedNicknames: ["라라진"],
    taggedMembers: ["라라진"],
    isLiked: false,
    isBookmarked: true,
    isFriendQuote: true,
    timeAgo: "3시간 전",
    createDate: "2025-11-03T19:02:00",
  },
  {
    id: 5,
    quoteId: 5,
    authorNickname: "몰랑이",
    authorIntroduction: "좋은 문장을 모아요",
    authorProfileImage: MOCK_PROFILE_IMAGE,
    content: "잘 쉬는 마음이 오래 걷는다",
    taggedNicknames: [],
    taggedMembers: [],
    isLiked: false,
    isBookmarked: false,
    isFriendQuote: true,
    timeAgo: "30분 전",
    createDate: "2025-11-03T19:02:00",
  },
];

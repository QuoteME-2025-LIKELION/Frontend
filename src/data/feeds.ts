// import type { Feed } from "@/types/feed.type";
// Feed 타입을 더 이상 사용하지 않으므로 주석처리

export const MOCK_FEEDS: {}[] = [
  {
    id: 1,
    content: "방귀 뀐 놈이 성낸다",
    createDate: "2025-12-12T21:52:40.724895",
    authorId: 1,
    authorName: "듀랄라",
    profileImageUrl: "https://avatars.githubusercontent.com/u/189887138?v=4",
    bio: "Positive Thinking",
    taggedUsers: [
      { id: 2, nickname: "어푸" },
      { id: 3, nickname: "라라진" },
    ],
    isLiked: false,
  },
  {
    id: 2,
    content: "가끔은 쉬어 갈 때도 필요하다",
    createDate: "2025-12-13T21:52:40.724895",
    authorId: 2,
    authorName: "어푸",
    profileImageUrl: "https://avatars.githubusercontent.com/u/183453942?v=4",
    bio: "작심삼일의 권위자",
    taggedUsers: [
      { id: 4, nickname: "스페이스" },
      { id: 3, nickname: "라라진" },
    ],
    isLiked: true,
  },
  {
    id: 3,
    content: "오늘 못한 건 내일의 에너지로 남는다",
    createDate: "2025-12-14T21:52:40.724895",
    authorId: 5,
    authorName: "듀가나다",
    bio: "due..",
    taggedUsers: [],
    isLiked: false,
  },
];

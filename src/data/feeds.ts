import type { Feed } from "@/types/feed.type";

export const MOCK_FEEDS: Feed[] = [
  {
    id: 1,
    content: "방귀 뀐 놈이 성낸다",
    createDate: "2025-12-12T21:52:40.724895",
    authorId: 1,
    taggedUsers: [
      { id: 10, nickname: "고냐니" },
      { id: 15, nickname: "가나디" },
    ],
  },
  {
    id: 2,
    content: "가끔은 쉬어 갈 때도 필요하다",
    createDate: "2025-12-13T21:52:40.724895",
    authorId: 2,
    taggedUsers: [
      { id: 10, nickname: "고냐니" },
      { id: 15, nickname: "가나디" },
    ],
  },
  {
    id: 3,
    content: "오늘 못한 건 내일의 에너지로 남는다",
    createDate: "2025-12-14T21:52:40.724895",
    authorId: 3,
    taggedUsers: [
      { id: 10, nickname: "고냐니" },
      { id: 15, nickname: "가나디" },
    ],
  },
];

import type { Notification } from "@/types/notification.type";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "POKE",
    message: "듀랄라님이 콕 찔렀습니다.",
    targetId: 1,
    senderName: "듀랄라",
    createDate: "2025-12-12T23:34:57.827965",
    isRead: false,
  },
  {
    id: 2,
    type: "TAG",
    message: "듀랄라님이 태그했습니다.",
    targetId: 1,
    senderName: "듀랄라",
    createDate: "2025-12-13T23:34:57.827965",
    isRead: false,
  },
  {
    id: 3,
    type: "GROUP",
    message: "어푸님이 그룹에 초대했습니다.",
    targetId: 2,
    senderName: "어푸",
    createDate: "2025-12-14T23:34:57.827965",
    isRead: false,
  },
  {
    id: 4,
    type: "TAG_REQUEST",
    message: "듀가나다님이 태그를 요청했습니다.",
    targetId: 5,
    senderName: "듀가나다",
    createDate: "2025-12-15T04:34:57.827965",
    isRead: false,
  },
];

import type { Notification } from "@/types/notification.type";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "POKE",
    message: "듀..님이 콕 찔렀습니다.",
    targetId: null,
    senderName: "듀..",
    createDate: "2025-12-12T23:34:57.827965",
    isRead: false,
  },
  {
    id: 2,
    type: "TAG",
    message: "듀..님이 태그를 요청하였습니다.",
    targetId: null,
    senderName: "듀..",
    createDate: "2025-12-12T23:34:57.827965",
    isRead: false,
  },
  {
    id: 3,
    type: "GROUP",
    message: "가나디님이 오늘의 명언을 남겼습니다.",
    targetId: null,
    senderName: "가나디",
    createDate: "2025-12-12T23:34:57.827965",
    isRead: false,
  },
];

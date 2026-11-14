import type { Notification } from "./notification.type";

export type MockNotification = Notification & {
  category: "GROUP" | "FRIEND" | "TAG" | null;
  createdAt: string;
  referenceId: number | null;
};

export type MockGroupJoinRequest = {
  requestId: number;
  requesterId: number;
  requesterNickname: string;
  requesterProfileImage?: string;
  createdAt: string;
};

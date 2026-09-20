import api from "@/api/api";
import type { Notification } from "@/types/notification.type";

export type NotificationCategory = "GROUP" | "FRIEND" | "TAG";

export interface UnreadNotificationCountResponse {
  count: number;
}

export interface NotificationSettings {
  groupEnabled: boolean;
  friendEnabled: boolean;
  tagEnabled: boolean;
  pokeEnabled: boolean;
  likeEnabled: boolean;
  quoteReminderEnabled: boolean;
  marketingEnabled: boolean;
}

/**
 * 알림 관련 API 함수 분리
 */
export const notificationApi = {
  getNotifications: (category?: NotificationCategory) =>
    api.get<Notification[]>("/api/notifications", { params: { category } }),
  getUnreadCount: () =>
    api.get<UnreadNotificationCountResponse>(
      "/api/notifications/unread-count"
    ),
  markAsRead: (notificationId: number) =>
    api.patch(`/api/notifications/${notificationId}/read`),
  getSettings: () =>
    api.get<NotificationSettings>("/api/notifications/settings"),
  updateSettings: (payload: NotificationSettings) =>
    api.put<NotificationSettings>("/api/notifications/settings", payload),
};

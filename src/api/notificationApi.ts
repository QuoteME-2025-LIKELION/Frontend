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
  quoteReminderTime: string | null;
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
  updateSettings: ({ quoteReminderTime, ...settings }: NotificationSettings) =>
    api.put<NotificationSettings>("/api/notifications/settings", {
      ...settings,
      // 서버는 시간 생략 시 기존 값을 유지한다. null은 전송하지 않는다.
      ...(quoteReminderTime != null ? { quoteReminderTime } : {}),
    }),
};

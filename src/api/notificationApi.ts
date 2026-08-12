import api from "@/api/api";
import type { Notification } from "@/types/notification.type";

/**
 * 알림 관련 API 함수 분리
 */
export const notificationApi = {
  getNotifications: () => api.get<Notification[]>("/api/notifications"),
  markAsRead: (notificationId: number) =>
    api.patch(`/api/notifications/${notificationId}/read`),
};

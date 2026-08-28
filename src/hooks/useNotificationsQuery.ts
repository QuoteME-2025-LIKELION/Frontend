import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  notificationApi,
  type NotificationCategory,
  type NotificationSettings,
} from "@/api/notificationApi";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (category?: NotificationCategory) =>
    [...notificationQueryKeys.all, "list", category ?? "all"] as const,
  unreadCount: () => [...notificationQueryKeys.all, "unread-count"] as const,
  settings: () => [...notificationQueryKeys.all, "settings"] as const,
};

/**
 * 알림 목록을 서버에서 조회하고 React Query 캐시에 저장
 */
export function useNotificationsQuery(category?: NotificationCategory) {
  return useQuery({
    queryKey: notificationQueryKeys.list(category),
    queryFn: async () => {
      const res = await notificationApi.getNotifications(category);
      return res.data;
    },
  });
}

/**
 * 미읽음 알림 수 조회
 */
export function useUnreadNotificationCountQuery() {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: async () => {
      const res = await notificationApi.getUnreadCount();
      return res.data;
    },
  });
}

/**
 * 알림 설정 조회
 */
export function useNotificationSettingsQuery() {
  return useQuery({
    queryKey: notificationQueryKeys.settings(),
    queryFn: async () => {
      const res = await notificationApi.getSettings();
      return res.data;
    },
  });
}

/**
 * 특정 알림을 읽음 처리한 뒤 알림 목록 캐시를 갱신
 */
export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

/**
 * 알림 설정 수정 후 설정 캐시 갱신
 */
export function useUpdateNotificationSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<NotificationSettings>) =>
      notificationApi.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.settings(),
      });
    },
  });
}

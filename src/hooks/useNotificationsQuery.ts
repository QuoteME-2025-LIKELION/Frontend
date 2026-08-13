import { notificationApi } from "@/api/notificationApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
};

/**
 * 알림 목록을 서버에서 조회하고 React Query 캐시에 저장
 */
export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationQueryKeys.all,
    queryFn: async () => {
      const res = await notificationApi.getNotifications();
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

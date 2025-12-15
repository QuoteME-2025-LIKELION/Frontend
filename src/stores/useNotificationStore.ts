import { create } from "zustand";
import api from "@/api/api";
import type { Notification } from "@/types/notification.type";

interface NotificationState {
  hasUnread: boolean;
  fetchNotifications: () => Promise<void>;
  setHasUnread: (hasUnread: boolean) => void;
}

/**
 * 알림 상태 관리 스토어 (DateHeader 알림 버튼 아이콘을 위함)
 * - hasUnread: 읽지 않은 알림이 있는지 여부
 * - fetchNotifications: 서버에서 알림을 가져와 hasUnread 상태를 업데이트
 * - setHasUnread: hasUnread 상태를 수동으로 설정
 */
const useNotificationStore = create<NotificationState>((set) => ({
  hasUnread: false,
  fetchNotifications: async () => {
    try {
      const res = await api.get<Notification[]>("/api/notifications");
      const unreadExists = res.data.some(
        (notification) => !notification.isRead
      );
      set({ hasUnread: unreadExists });
    } catch (err) {
      console.error("알림 상태 불러오기 실패:", err);
      set({ hasUnread: false }); // 에러 발생 시 기본값으로 설정
    }
  },
  setHasUnread: (hasUnread) => set({ hasUnread }),
}));

export default useNotificationStore;

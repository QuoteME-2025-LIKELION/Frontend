import { create } from "zustand";

interface NotificationState {
  hasUnread: boolean;
  setHasUnread: (hasUnread: boolean) => void;
}

/**
 * 알림 상태 관리 스토어 (DateHeader 알림 버튼 아이콘을 위함)
 * - hasUnread: 읽지 않은 알림이 있는지 여부
 * - setHasUnread: hasUnread 상태를 수동으로 설정
 */
const useNotificationStore = create<NotificationState>((set) => ({
  hasUnread: false,
  setHasUnread: (hasUnread) =>
    set((state) => (state.hasUnread === hasUnread ? state : { hasUnread })),
}));

export default useNotificationStore;

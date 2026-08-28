import type { Notification } from "@/types/notification.type";

import * as S from "../Notification.styles";
import NotificationLog from "../NotificationLog/NotificationLog";

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

/**
 * 알림 목록 또는 빈 상태를 렌더링
 */
export default function NotificationList({
  notifications,
  onNotificationClick,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <S.Message>
        <S.MessageText>도착한 알림이 없어요.</S.MessageText>
        <S.MessageText>알림이 오면 바로 알려드릴게요.</S.MessageText>
      </S.Message>
    );
  }

  return (
    <S.NotificationList>
      <S.NotificationWrapper>
        {notifications.map((item) => (
          <NotificationLog
            key={item.id}
            notification={item}
            onClick={() => onNotificationClick(item)}
          />
        ))}
      </S.NotificationWrapper>
    </S.NotificationList>
  );
}

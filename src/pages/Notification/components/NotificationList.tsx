import type { Notification } from "@/types/notification.type";

import * as S from "../Notification.styles";
import NotificationLog from "../NotificationLog/NotificationLog";

interface NotificationListProps {
  selectedFilter: string | null;
  groupedNotifications: Array<[string, Notification[]]>;
  filteredNotifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

/**
 * 선택된 필터 상태에 따라 빈 상태, 날짜별 알림 목록, 필터 결과 목록을 렌더링
 */
export default function NotificationList({
  selectedFilter,
  groupedNotifications,
  filteredNotifications,
  onNotificationClick,
}: NotificationListProps) {
  const isEmpty =
    selectedFilter === null
      ? groupedNotifications.length === 0
      : filteredNotifications.length === 0;

  if (isEmpty) {
    return (
      <S.Message>
        <S.MessageText>도착한 알림이 없어요.</S.MessageText>
        <S.MessageText>알림이 오면 바로 알려드릴게요.</S.MessageText>
      </S.Message>
    );
  }

  if (selectedFilter === null) {
    return (
      <S.NotificationList>
        {groupedNotifications.map(([dateKey, items]) => (
          <S.NotificationBox key={dateKey}>
            <S.TimeStamp>{dateKey}</S.TimeStamp>
            <S.NotificationWrapper>
              {items.map((item) => (
                <NotificationLog
                  key={item.id}
                  notification={item}
                  onClick={() => onNotificationClick(item)}
                />
              ))}
            </S.NotificationWrapper>
          </S.NotificationBox>
        ))}
      </S.NotificationList>
    );
  }

  return (
    <S.NotificationList>
      <S.NotificationWrapper>
        {filteredNotifications.map((item) => (
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

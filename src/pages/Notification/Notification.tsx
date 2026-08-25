import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import {
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/hooks/useNotificationsQuery";
import useNotificationStore from "@/stores/useNotificationStore";
import type { Notification } from "@/types/notification.type";

import NotificationFilterTabs, {
  type NotificationFilter,
} from "./components/NotificationFilterTabs";
import NotificationList from "./components/NotificationList";
import * as S from "./Notification.styles";

export default function Notification() {
  const [selectedFilter, setSelectedFilter] =
    useState<NotificationFilter | null>(null);
  const navigate = useNavigate();

  const { setHasUnread } = useNotificationStore();

  // 알림 목록 조회와 읽음 처리 mutation을 React Query로 관리
  const { data: notifications = [], isError } = useNotificationsQuery(
    selectedFilter ?? undefined
  );
  const { mutateAsync: markNotificationRead } =
    useMarkNotificationReadMutation();

  // 조회 결과를 전역 unread 상태와 동기화
  useEffect(() => {
    if (isError) {
      setHasUnread(false);
      return;
    }

    setHasUnread(notifications.some((notification) => !notification.isRead));
  }, [isError, notifications, setHasUnread]);

  const sortedNotifications = [...notifications].sort(
    (a, b) =>
      new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
  );

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      try {
        // 알림 읽음 처리 (아직 안 읽은 경우에만)
        if (!notification.isRead) {
          await markNotificationRead(notification.id);
        }
      } catch (err) {
        console.error(err);
      }

      // 알림 유형에 맞는 화면으로 이동
      const { type } = notification;
      switch (type) {
        case "GROUP":
          // 그룹 알림은 그룹 페이지로 이동
          navigate(`/group/${notification.targetId}`);
          break;
        case "POKE":
          // 콕 찌르기 받았으니 자동으로 글쓰기로 이동
          navigate("/write");
          break;
        case "TAG":
          navigate(`/home/${notification.createDate.slice(0, 10)}`);
          break;
        case "TAG_REQUEST":
          navigate("/fix", {
            state: {
              date: notification.createDate.slice(0, 10),
              quoteId: notification.targetId,
              requestedNickname: notification.senderName,
            },
          });
          break;
      }
    },
    [navigate, markNotificationRead]
  );

  return (
    <>
      <PageTitle title="알림" />
      <S.Container>
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="알림"
          backgroundColor="secondary"
          onClickXBtn={() => navigate("/home")}
        />
        <NotificationFilterTabs
          selectedFilter={selectedFilter}
          onChangeFilter={setSelectedFilter}
        />
        <NotificationList
          notifications={sortedNotifications}
          onNotificationClick={handleNotificationClick}
        />
      </S.Container>
    </>
  );
}

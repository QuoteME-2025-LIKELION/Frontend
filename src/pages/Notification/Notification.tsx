import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { quoteApi } from "@/api/quoteApi";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import {
  useMarkNotificationReadMutation,
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
} from "@/hooks/useNotificationsQuery";
import { quoteQueryKeys } from "@/hooks/useQuoteQueries";
import useNotificationStore from "@/stores/useNotificationStore";
import type { Notification } from "@/types/notification.type";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import {
  getNotificationFeedPath,
  getNotificationQuoteDate,
} from "@/utils/getNotificationFeedPath";
import { getWritingNotificationDestination } from "@/utils/getWritingNotificationDestination";

import NotificationFilterTabs, {
  type NotificationFilter,
} from "./components/NotificationFilterTabs";
import NotificationList from "./components/NotificationList";
import * as S from "./Notification.styles";

export default function Notification() {
  const [selectedFilter, setSelectedFilter] =
    useState<NotificationFilter | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [navigationError, setNavigationError] = useState("");

  const { setHasUnread } = useNotificationStore();

  // 알림 목록 조회와 읽음 처리 mutation을 React Query로 관리
  const { data: notifications = [] } = useNotificationsQuery(
    selectedFilter ?? undefined
  );
  const { data: unreadCount, isError: isUnreadCountError } =
    useUnreadNotificationCountQuery();
  const { mutateAsync: markNotificationRead } =
    useMarkNotificationReadMutation();

  // 전체 미읽음 수를 전역 unread 상태와 동기화
  useEffect(() => {
    if (isUnreadCountError || unreadCount === undefined) {
      return;
    }

    setHasUnread(unreadCount.count > 0);
  }, [isUnreadCountError, setHasUnread, unreadCount]);

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
        case "GROUP_ACCEPT":
        case "GROUP_JOIN_REQUEST":
          // 대상이 없는 알림에서는 잘못된 /group/null 경로로 이동하지 않는다.
          if (notification.targetId === null) {
            setNavigationError("알림의 대상 그룹을 확인할 수 없어요.");
            break;
          }
          navigate(`/group/${notification.targetId}`, {
            state: { returnTo: "/notification" },
          });
          break;
        case "GROUP_INVITE":
          navigate("/friend-group/add", {
            state: { returnTo: "/notification" },
          });
          break;
        case "FRIEND_REQUEST":
          navigate("/friend-group/add", {
            state: { returnTo: "/notification" },
          });
          break;
        case "GROUP_REJECT":
        case "FRIEND_ACCEPTED":
          navigate("/friend-group", {
            state: { returnTo: "/notification" },
          });
          break;
        case "QUOTE_REMINDER":
        case "POKE": {
          setNavigationError("");
          const today = formatDateToYYYYMMDD(new Date());
          try {
            const quotes = await queryClient.fetchQuery({
              queryKey: quoteQueryKeys.byDate(today),
              queryFn: async () => (await quoteApi.getQuotesByDate(today)).data,
              staleTime: 0,
              retry: false,
            });
            const destination = getWritingNotificationDestination(
              quotes.myQuotes,
              today
            );
            navigate(destination.path, { state: destination.state });
          } catch {
            setNavigationError(
              "오늘의 명언을 확인하지 못했어요. 알림을 다시 눌러 주세요."
            );
          }
          break;
        }
        case "TAG":
        case "TAG_ACCEPTED":
          navigate(getNotificationFeedPath(notification.quoteDate), {
            state: { returnTo: "/notification" },
          });
          break;
        case "TAG_REQUEST": {
          const date = getNotificationQuoteDate(notification.quoteDate);
          if (!date || notification.targetId === null) {
            navigate("/home", { state: { returnTo: "/notification" } });
            break;
          }
          navigate("/fix", {
            state: {
              returnTo: "/notification",
              date,
              quoteId: notification.targetId,
              requestedNickname: notification.senderName,
            },
          });
          break;
        }
      }
    },
    [navigate, markNotificationRead, queryClient]
  );

  return (
    <>
      <PageTitle title="알림" />
      {navigationError && (
        <ToastModal
          text={navigationError}
          isVisible={true}
          onClose={() => setNavigationError("")}
          showOverlay={false}
          variant="snackbar"
        />
      )}
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

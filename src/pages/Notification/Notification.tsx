import Header from "@/components/Header/Header";
import * as S from "./Notification.styles";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import NotificationLog from "@/pages/Notification/NotificationLog/NotificationLog";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { Notification } from "@/types/notification.type";
import useNotificationStore from "@/stores/useNotificationStore";
import {
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/hooks/useNotificationsQuery";
// 날짜별 그룹핑
function groupByDate(list: Notification[]) {
  const map: Record<string, Notification[]> = {};
  // 최신순으로 먼저 정렬
  const sortedList = [...list].sort(
    (a, b) =>
      new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
  );

  sortedList.forEach((item) => {
    const groupKey = formatTimeAgo(item.createDate);
    if (!map[groupKey]) {
      map[groupKey] = [];
    }
    map[groupKey].push(item);
  });

  // map의 생성 순서가 그룹의 시간 순서를 보장
  return Object.entries(map);
}

export default function Notification() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  const { setHasUnread } = useNotificationStore();

  // 알림 목록 조회와 읽음 처리 mutation을 React Query로 관리
  const { data: notifications = [], isError } = useNotificationsQuery();
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

  // 필터 적용된 배열
  const filtered = useMemo(() => {
    if (selectedFilter === "TAGS") {
      return notifications.filter(
        (n) => n.type === "TAG" || n.type === "TAG_REQUEST"
      );
    }
    return selectedFilter
      ? notifications.filter((n) => n.type === selectedFilter)
      : notifications;
  }, [selectedFilter, notifications]);

  // 날짜 그룹핑 (필터 없을 때만 사용)
  const grouped = useMemo(
    () => (selectedFilter === null ? groupByDate(filtered) : []),
    [filtered, selectedFilter]
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
          // id로 명언 찾는 API가 아직 미비해서 일단 home으로 이동
          navigate("/home");
          break;
      }

    },
    [navigate, markNotificationRead]
  );

  // 렌더링 분기를 위한 빈 상태 계산
  const isEmpty =
    selectedFilter === null ? grouped.length === 0 : filtered.length === 0;

  // 빈 상태, 전체보기, 필터 결과를 각각 다른 목록 형태로 렌더링
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
        <S.Menu>
          <S.Btn
            onClick={() => setSelectedFilter(null)}
            $active={selectedFilter === null}
          >
            전체보기
          </S.Btn>
          <S.Btn
            onClick={() =>
              setSelectedFilter((prev) => (prev === "GROUP" ? null : "GROUP"))
            }
            $active={selectedFilter === "GROUP"}
          >
            그룹 알림
          </S.Btn>
          <S.Btn
            onClick={() =>
              setSelectedFilter((prev) => (prev === "POKE" ? null : "POKE"))
            }
            $active={selectedFilter === "POKE"}
          >
            콕 찌르기
          </S.Btn>
          <S.Btn
            onClick={() =>
              setSelectedFilter((prev) => (prev === "TAGS" ? null : "TAGS"))
            }
            $active={selectedFilter === "TAGS"}
          >
            태그
          </S.Btn>
        </S.Menu>
        {isEmpty ? (
          <S.Message>
            <S.MessageText>도착한 알림이 없어요</S.MessageText>
            <S.MessageText>알림이 오면 바로 알려드릴게요</S.MessageText>
          </S.Message>
        ) : selectedFilter === null ? (
          <S.NotificationList>
            {grouped.map(([dateKey, items]) => (
              <S.NotificationBox key={dateKey}>
                <S.TimeStamp>{dateKey}</S.TimeStamp>
                <S.NotificationWrapper>
                  {items.map((item) => (
                    <NotificationLog
                      key={item.id}
                      notification={item}
                      onClick={() => handleNotificationClick(item)}
                    />
                  ))}
                </S.NotificationWrapper>
              </S.NotificationBox>
            ))}
          </S.NotificationList>
        ) : (
          <S.NotificationList>
            <S.NotificationWrapper>
              {filtered.map((item) => (
                <NotificationLog
                  key={item.id}
                  notification={item}
                  onClick={() => handleNotificationClick(item)}
                />
              ))}
            </S.NotificationWrapper>
          </S.NotificationList>
        )}
      </S.Container>
    </>
  );
}

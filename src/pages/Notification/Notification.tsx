import Header from "@/components/Header/Header";
import * as S from "./NotificationStyle";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import NotificationLog from "@/pages/Notification/NotificationLog/NotificationLog";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { Notification } from "@/types/notification.type";
import api from "@/api/api";
import useNotificationStore from "@/stores/useNotificationStore";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  // 필터 null일 때는 모든 알림 api 호출한 뒤 가공 (가공 로직 추후 구현)
  // 필터가 선택됐을 땐 null일 때 데이터에서 필터해서 렌더링

  const { setHasUnread } = useNotificationStore();
  const [selectedTagRequest, setSelectedTagRequest] =
    useState<Notification | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get<Notification[]>("/api/notifications");
      setNotifications(res.data);
      // 알림을 가져온 후 전역 상태도 업데이트
      const unreadExists = res.data.some((n) => !n.isRead);
      setHasUnread(unreadExists);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    }
  }, [setHasUnread]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
          await api.patch(`/api/notifications/${notification.id}/read`);
        }
      } catch (err) {
        console.error(err);
      }
      const res = await api.get("/api/notifications");
      console.log(res.data);
      const { type } = notification;
      if (type === "GROUP") {
        navigate(`/group/${notification.targetId}`);
      } else if (type === "POKE") {
        // 콕 찌르기 받았으니 자동으로 글쓰기로 이동
        navigate("/write");
      } else if (type === "TAG" || type === "TAG_REQUEST") {
        setSelectedTagRequest(notification);
        navigate("/home");
      }

      // 상태 업데이트를 위해 알림 목록 다시 불러오기
      fetchNotifications();
    },
    [navigate, fetchNotifications]
  );
  const handleAcceptTag = async () => {
    if (!selectedTagRequest?.requestId) return;

    try {
      await api.post(
        `/api/quotes/requests/${selectedTagRequest.requestId}/accept`
      );
      setSelectedTagRequest(null);
      fetchNotifications();
    } catch (err) {
      console.error("태그 요청 수락 실패", err);
    }
  };

  const handleRejectTag = async () => {
    if (!selectedTagRequest?.requestId) return;

    try {
      await api.post(
        `/api/quotes/requests/${selectedTagRequest.requestId}/reject`
      );
      setSelectedTagRequest(null);
      fetchNotifications();
    } catch (err) {
      console.error("태그 요청 거절 실패", err);
    }
  };

  return (
    <>
      <PageTitle title="알림" />
      <S.Container>
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="알림함"
          backgroundColor="white"
          onClickXBtn={() => navigate("/home")}
        />
        <S.Menu>
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
        {selectedFilter === null ? (
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
      {selectedTagRequest && (
        <ConfirmModal
          nickname={selectedTagRequest.senderName}
          question="님이 태그 요청을 보냈습니다."
          onClose={handleRejectTag} // 🔴 취소 = 거절
          onConfirm={handleAcceptTag} // 🔵 확인 = 수락
        />
      )}
    </>
  );
}

import Header from "@/components/Header/Header";
import * as S from "./NotificationStyle";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import NotificationLog from "@/pages/Notification/NotificationLog/NotificationLog";
import { formatTimeAgo } from "@/hooks/formatTimeAgo";

type NotificationState =
  | "group-noti"
  | "friend-request"
  | "tag-request"
  | "poke";

interface NotificationItem {
  id: number;
  state: NotificationState;
  nickname: string;
  timestamp: string; // ISO 또는 'YYYY-MM-DDTHH:mm:ss'
}

// 목데이터 (테스트용) (글 작성 API 참고)
const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    state: "group-noti",
    nickname: "듀랄라",
    timestamp: "2025-12-01T08:19:00.2625689",
  },
  {
    id: 2,
    state: "poke",
    nickname: "공룡",
    timestamp: "2025-12-01T09:05:00.2625689",
  },
  {
    id: 3,
    state: "tag-request",
    nickname: "듀..",
    timestamp: "2025-11-30T22:10:00.2625689",
  },
  {
    id: 4,
    state: "friend-request",
    nickname: "듀..",
    timestamp: "2025-11-28T14:00:00.2625689",
  },
  {
    id: 5,
    state: "group-noti",
    nickname: "가나디",
    timestamp: "2025-11-28T07:30:00.2625689",
  },
];

// 날짜별 그룹핑
function groupByDate(list: NotificationItem[]) {
  const map: Record<string, NotificationItem[]> = {};
  // 최신순으로 먼저 정렬
  const sortedList = [...list].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  sortedList.forEach((item) => {
    const groupKey = formatTimeAgo(item.timestamp);
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
  // 필터 null일 때는 모든 알림 api 호출한 뒤 가공 (가공 로직 추후 구현)
  // 필터가 선택됐을 땐 null일 때 데이터에서 필터해서 렌더링

  // 필터 적용된 배열
  const filtered = useMemo(
    () =>
      selectedFilter
        ? mockNotifications.filter((n) => n.state === selectedFilter)
        : mockNotifications,
    [selectedFilter]
  );

  // 날짜 그룹핑 (필터 없을 때만 사용)
  const grouped = useMemo(
    () => (selectedFilter === null ? groupByDate(filtered) : []),
    [filtered, selectedFilter]
  );

  return (
    <S.Container>
      <Header
        showBackBtn={false}
        showXBtn={true}
        title="알림함"
        backgroundColor="white"
        onClickXBtn={() => navigate(-1)}
      />
      <S.Menu>
        <S.Btn
          onClick={() =>
            setSelectedFilter((prev) =>
              prev === "group-noti" ? null : "group-noti"
            )
          }
          $active={selectedFilter === "group-noti"}
        >
          그룹 알림
        </S.Btn>
        <S.Btn
          onClick={() =>
            setSelectedFilter((prev) => (prev === "poke" ? null : "poke"))
          }
          $active={selectedFilter === "poke"}
        >
          콕 찌르기
        </S.Btn>
        <S.Btn
          onClick={() =>
            setSelectedFilter((prev) =>
              prev === "tag-request" ? null : "tag-request"
            )
          }
          $active={selectedFilter === "tag-request"}
        >
          태그 요청
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
                    state={item.state}
                    nickname={item.nickname}
                    timestamp={item.timestamp}
                    onClick={() => console.log("알림 클릭:", item.id)}
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
                state={item.state}
                nickname={item.nickname}
                timestamp={item.timestamp}
                onClick={() => console.log("필터된 알림 클릭:", item.id)}
              />
            ))}
          </S.NotificationWrapper>
        </S.NotificationList>
      )}
    </S.Container>
  );
}

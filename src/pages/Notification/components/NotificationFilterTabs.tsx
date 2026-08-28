import * as S from "../Notification.styles";

export type NotificationFilter = "GROUP" | "FRIEND" | "TAG";

interface NotificationFilterTabsProps {
  selectedFilter: NotificationFilter | null;
  onChangeFilter: (filter: NotificationFilter | null) => void;
}

const FILTER_TABS: Array<{
  label: string;
  value: NotificationFilter | null;
}> = [
  { label: "전체보기", value: null },
  { label: "그룹", value: "GROUP" },
  { label: "친구", value: "FRIEND" },
  { label: "태그", value: "TAG" },
];

/**
 * 알림 유형 필터 탭을 렌더링하고 같은 탭을 다시 누르면 전체보기로 되돌림
 */
export default function NotificationFilterTabs({
  selectedFilter,
  onChangeFilter,
}: NotificationFilterTabsProps) {
  return (
    <S.Menu>
      {FILTER_TABS.map(({ label, value }) => (
        <S.Btn
          key={label}
          onClick={() =>
            onChangeFilter(selectedFilter === value ? null : value)
          }
          $active={selectedFilter === value}
        >
          {label}
        </S.Btn>
      ))}
    </S.Menu>
  );
}

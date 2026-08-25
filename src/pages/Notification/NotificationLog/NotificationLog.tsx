import type { Notification } from "@/types/notification.type";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

import * as S from "./NotificationLog.styles";

interface NotificationLogProps {
  notification: Notification;
  onClick?: () => void;
}

/**
 * 알림 로그 컴포넌트
 * @param props
 * @param props.notification 알림 객체
 * @param props.onClick 클릭 이벤트 핸들러
 * @example
 * <NotificationLog
 *  notification={notification}
 *  onClick={handleClick}
 * />
 * @returns
 */
export default function NotificationLog({
  notification,
  onClick,
}: NotificationLogProps) {
  const { senderName, type, createDate } = notification;
  const formattedTimeAgo = createDate ? formatTimeAgo(createDate) : "";
  const category =
    type === "GROUP"
      ? "그룹"
      : type === "TAG" || type === "TAG_REQUEST"
        ? "태그"
        : "친구";
  const iconVariant =
    type === "GROUP"
      ? "group"
      : type === "TAG" || type === "TAG_REQUEST"
        ? "tag"
        : "friend";
  const iconText = iconVariant === "friend" ? "Q" : "G";

  const renderMessage = () => {
    switch (type) {
      case "GROUP":
        return <>님이 그룹에 초대했습니다.</>;
      case "TAG":
        return <>님이 태그했습니다.</>;
      case "TAG_REQUEST":
        return <>님이 태그를 요청하였습니다.</>;
      case "POKE":
        return <>님이 콕 찔렀습니다.</>;
      default:
        return null;
    }
  };

  return (
    <S.Container onClick={onClick}>
      <S.Icon $variant={iconVariant}>{iconText}</S.Icon>
      <S.Wrapper>
        <S.TextBox>
          <S.Category>{category}</S.Category>
          <S.Message>
            {senderName}
            {renderMessage()}
          </S.Message>
        </S.TextBox>
        <S.Timestamp>{formattedTimeAgo}</S.Timestamp>
      </S.Wrapper>
    </S.Container>
  );
}

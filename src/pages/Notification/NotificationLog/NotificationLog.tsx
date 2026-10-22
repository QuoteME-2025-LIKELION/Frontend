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
  const { message, senderName, type, createDate } = notification;
  const formattedTimeAgo = createDate ? formatTimeAgo(createDate) : "";
  const isGroupNotification = type.startsWith("GROUP");
  const isTagNotification = type.startsWith("TAG");
  const category = isGroupNotification
    ? "그룹"
    : isTagNotification
      ? "태그"
      : "친구";
  const iconVariant = isGroupNotification
    ? "group"
    : isTagNotification
      ? "tag"
      : "friend";
  const iconText = iconVariant === "friend" ? "Q" : "G";

  const renderMessage = () => {
    if (message) {
      return message;
    }

    switch (type) {
      case "GROUP":
      case "GROUP_INVITE":
        return <>님이 그룹에 초대했습니다.</>;
      case "GROUP_ACCEPT":
        return <>님이 그룹 초대를 수락했습니다.</>;
      case "GROUP_JOIN_REQUEST":
        return <>님이 그룹 가입을 요청했습니다.</>;
      case "GROUP_REJECT":
        return <>님이 그룹 가입 요청을 거절했습니다.</>;
      case "FRIEND_REQUEST":
        return <>님이 친구 요청을 보냈습니다.</>;
      case "FRIEND_ACCEPTED":
        return <>님이 친구 요청을 수락했습니다.</>;
      case "TAG":
        return <>님이 태그했습니다.</>;
      case "TAG_ACCEPTED":
        return <>님이 태그 요청을 수락했습니다.</>;
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
      <S.Icon $variant={iconVariant} $isRead={notification.isRead}>
        {iconText}
      </S.Icon>
      <S.Wrapper>
        <S.TextBox>
          <S.Category>{category}</S.Category>
          <S.Message>
            {!message && senderName}
            {renderMessage()}
          </S.Message>
        </S.TextBox>
        <S.Timestamp>{formattedTimeAgo}</S.Timestamp>
      </S.Wrapper>
    </S.Container>
  );
}

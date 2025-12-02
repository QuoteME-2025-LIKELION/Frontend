import { formatTimeAgo } from "@/utils/formatTimeAgo";
import * as S from "./NotificationLogStyle";

interface NotificationLogProps {
  state: "group-noti" | "friend-request" | "tag-request" | "poke";
  nickname: string;
  timestamp: string;
  onClick?: () => void;
}

/**
 * 알림 로그 컴포넌트
 * @param props
 * @param props.state 알림 상태 (그룹 알림, 친구 요청, 태그 요청, 콕 찌르기)
 * @param props.nickname 사용자 닉네임
 * @param props.timestamp 알림 발생 시간 (헬퍼 함수로 포맷팅)
 * @param props.onClick 클릭 이벤트 핸들러
 * @example
 * <NotificationLog
 *  state="group-noti"
 *  nickname="듀랄라"
 *  timestamp="2025-11-27 08:19:00"
 * />
 * @returns
 */
export default function NotificationLog({
  state,
  nickname,
  timestamp,
  onClick,
}: NotificationLogProps) {
  const formattedTimeAgo = timestamp ? formatTimeAgo(timestamp) : "";

  const renderMessage = () => {
    switch (state) {
      case "group-noti":
        return <>님이 오늘의 명언을 남겼습니다.</>;
      case "friend-request":
        return <>님이 친구를 요청하였습니다.</>;
      case "tag-request":
        return <>님이 태그를 요청하였습니다.</>;
      case "poke":
        return <>님이 콕 찔렀습니다.</>;
      default:
        return null;
    }
  };

  return (
    <S.Container onClick={onClick}>
      {state === "group-noti" || state === "friend-request" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M9.33337 9.49935C9.687 9.49935 10.0261 9.35887 10.2762 9.10882C10.5262 8.85878 10.6667 8.51964 10.6667 8.16602V5.49935H9.33337M5.33337 9.49935C5.687 9.49935 6.02613 9.35887 6.27618 9.10882C6.52623 8.85878 6.66671 8.51964 6.66671 8.16602V5.49935H5.33337M14.6667 11.4993C14.6667 11.853 14.5262 12.1921 14.2762 12.4422C14.0261 12.6922 13.687 12.8327 13.3334 12.8327H4.55204C4.19845 12.8328 3.85936 12.9733 3.60937 13.2233L2.14137 14.6913C2.07518 14.7575 1.99084 14.8026 1.89903 14.8209C1.80722 14.8391 1.71206 14.8297 1.62558 14.7939C1.5391 14.7581 1.46518 14.6974 1.41316 14.6196C1.36115 14.5418 1.33339 14.4503 1.33337 14.3567V3.49935C1.33337 3.14573 1.47385 2.80659 1.7239 2.55654C1.97395 2.30649 2.31309 2.16602 2.66671 2.16602H13.3334C13.687 2.16602 14.0261 2.30649 14.2762 2.55654C14.5262 2.80659 14.6667 3.14573 14.6667 3.49935V11.4993Z"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : state === "tag-request" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <g clip-path="url(#clip0_737_1386)">
            <path
              d="M14.6666 7.33334V8.00001C14.6599 9.34555 14.2461 10.6576 13.4798 11.7636C12.7134 12.8696 11.6303 13.7178 10.3729 14.1967C9.11542 14.6756 7.74248 14.7628 6.43454 14.4468C5.1266 14.1309 3.94489 13.4265 3.04475 12.4264C2.14462 11.4262 1.56819 10.1771 1.39126 8.84321C1.21433 7.50933 1.44518 6.15313 2.05345 4.9529C2.66172 3.75267 3.61894 2.76459 4.79927 2.11856C5.97961 1.47254 7.32781 1.1988 8.66663 1.33334M5.3333 9.33334C5.3333 9.33334 6.3333 10.6667 7.99996 10.6667C9.66663 10.6667 10.6666 9.33334 10.6666 9.33334M5.99996 6.00001H6.00663M9.99996 6.00001H10.0066M10.6666 3.33334H14.6666M12.6666 1.33334V5.33334"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_737_1386">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <g clip-path="url(#clip0_737_2564)">
            <path
              d="M12 7.33337V4.00004C12 3.64642 11.8595 3.30728 11.6095 3.05723C11.3594 2.80718 11.0203 2.66671 10.6667 2.66671C10.313 2.66671 9.97389 2.80718 9.72384 3.05723C9.4738 3.30728 9.33332 3.64642 9.33332 4.00004M9.33332 6.66671V2.66671C9.33332 2.31309 9.19284 1.97395 8.9428 1.7239C8.69275 1.47385 8.35361 1.33337 7.99999 1.33337C7.64636 1.33337 7.30723 1.47385 7.05718 1.7239C6.80713 1.97395 6.66665 2.31309 6.66665 2.66671V4.00004M6.66665 4.00004V7.00004M6.66665 4.00004C6.66665 3.64642 6.52618 3.30728 6.27613 3.05723C6.02608 2.80718 5.68694 2.66671 5.33332 2.66671C4.9797 2.66671 4.64056 2.80718 4.39051 3.05723C4.14046 3.30728 3.99999 3.64642 3.99999 4.00004V9.33337M12 5.33337C12 4.97975 12.1405 4.64061 12.3905 4.39056C12.6406 4.14052 12.9797 4.00004 13.3333 4.00004C13.6869 4.00004 14.0261 4.14052 14.2761 4.39056C14.5262 4.64061 14.6667 4.97975 14.6667 5.33337V9.33337C14.6667 10.7479 14.1048 12.1044 13.1046 13.1046C12.1044 14.1048 10.7478 14.6667 9.33332 14.6667H7.99999C6.13332 14.6667 4.99999 14.0934 4.00665 13.1067L1.60665 10.7067C1.37728 10.4527 1.25438 10.1202 1.2634 9.778C1.27243 9.43585 1.41269 9.11027 1.65513 8.86868C1.89758 8.62709 2.22365 8.48798 2.56584 8.48017C2.90802 8.47236 3.2401 8.59643 3.49332 8.82671L4.66665 10"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_737_2564">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )}
      <S.Wrapper>
        <S.TextBox>
          <S.Nickname>{nickname}</S.Nickname>
          <S.Message>{renderMessage()}</S.Message>
        </S.TextBox>
        <S.Timestamp>{formattedTimeAgo}</S.Timestamp>
      </S.Wrapper>
    </S.Container>
  );
}

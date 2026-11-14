import { useId, useState } from "react";

import type { FriendRequest } from "@/api/friendApi";

import * as S from "../FriendGroup.styles";

interface FriendRequestSectionProps {
  requests: FriendRequest[];
  pendingRequestId?: number | null;
  pendingCancellationId?: number | null;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
  onCancel: (receiverId: number) => void;
}

export default function FriendRequestSection({
  requests,
  pendingRequestId = null,
  pendingCancellationId = null,
  onAccept,
  onReject,
  onCancel,
}: FriendRequestSectionProps) {
  const [direction, setDirection] = useState<"RECEIVED" | "SENT">("RECEIVED");
  const id = useId();
  const hasSent = requests.some((request) => request.direction === "SENT");
  const hasReceived = requests.some((request) => request.direction !== "SENT");
  const isSent = hasSent && (direction === "SENT" || !hasReceived);
  const RequestItem = isSent ? S.SentRequestItem : S.RequestItem;
  const visibleRequests = requests.filter((request) =>
    isSent ? request.direction === "SENT" : request.direction !== "SENT"
  );

  if (!hasSent && !hasReceived) return null;

  return (
    <S.Section>
      <S.RequestTabs aria-label="친구 요청 구분">
        {hasReceived && (
          <S.RequestTab
            type="button"
            id={`${id}-received`}
            aria-pressed={!isSent}
            aria-controls={`${id}-list`}
            onClick={() => setDirection("RECEIVED")}
          >
            받은 친구 요청
          </S.RequestTab>
        )}
        {hasSent && (
          <S.RequestTab
            type="button"
            id={`${id}-sent`}
            aria-pressed={isSent}
            aria-controls={`${id}-list`}
            onClick={() => setDirection("SENT")}
          >
            보낸 친구 요청
          </S.RequestTab>
        )}
      </S.RequestTabs>
      <S.FriendList
        id={`${id}-list`}
        role="region"
        aria-labelledby={`${id}-${isSent ? "sent" : "received"}`}
      >
        {visibleRequests.map((request) => {
          const nickname = isSent
            ? (request.receiverNickname ?? "사용자")
            : request.senderNickname;
          const profileImage = isSent
            ? request.receiverProfileImage
            : request.senderProfileImage;
          const introduction = isSent
            ? request.receiverIntroduction
            : request.senderIntroduction;
          const isPending = pendingRequestId === request.requestId;

          return (
            <RequestItem key={request.requestId}>
              {profileImage ? (
                <S.RequestProfileImg
                  src={profileImage}
                  alt={`${nickname} 프로필 이미지`}
                />
              ) : (
                <S.RequestDefaultProfileImg />
              )}
              <S.RequestUserBox>
                <S.RequestUsername>{nickname}</S.RequestUsername>
                {introduction && (
                  <S.RequestIntro>{introduction}</S.RequestIntro>
                )}
              </S.RequestUserBox>
              {isSent ? (
                <S.RequestCancelActionBox>
                  <button
                    type="button"
                    disabled={
                      pendingCancellationId !== null ||
                      request.receiverId == null
                    }
                    aria-label={`${nickname}에게 보낸 친구 요청 취소`}
                    onClick={() => {
                      if (request.receiverId != null)
                        onCancel(request.receiverId);
                    }}
                  >
                    취소
                  </button>
                </S.RequestCancelActionBox>
              ) : (
                <S.RequestActionBox>
                  <button
                    type="button"
                    disabled={isPending}
                    aria-label={`${nickname} 친구 요청 승인`}
                    onClick={() => onAccept(request.requestId)}
                  >
                    승인
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    aria-label={`${nickname} 친구 요청 거절`}
                    onClick={() => onReject(request.requestId)}
                  >
                    거절
                  </button>
                </S.RequestActionBox>
              )}
            </RequestItem>
          );
        })}
      </S.FriendList>
    </S.Section>
  );
}

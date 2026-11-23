import { type KeyboardEvent, useId, useState } from "react";

import type { GroupInvitation, GroupJoinRequestSent } from "@/api/groupApi";

import * as S from "../FriendGroup.styles";

interface GroupInvitationSectionProps {
  invitations: GroupInvitation[];
  sentRequests: GroupJoinRequestSent[];
  cancelPending: boolean;
  onCancel: (requestId: number) => void;
  pendingInvitationId?: number | null;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

/**
 * 받은 그룹 초대와 보낸 가입 신청을 표시한다.
 */
export default function GroupInvitationSection({
  invitations,
  sentRequests,
  cancelPending,
  onCancel,
  pendingInvitationId = null,
  onAccept,
  onReject,
}: GroupInvitationSectionProps) {
  const id = useId();
  const [showSent, setShowSent] = useState(false);
  const hasReceived = invitations.length > 0;
  const hasSent = sentRequests.length > 0;
  const isSent = hasSent && (showSent || !hasReceived);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!hasReceived || !hasSent) return;

    let nextSent: boolean;
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowRight":
        nextSent = !isSent;
        break;
      case "Home":
        nextSent = false;
        break;
      case "End":
        nextSent = true;
        break;
      default:
        return;
    }

    event.preventDefault();
    setShowSent(nextSent);
    event.currentTarget.ownerDocument
      .getElementById(`${id}-${nextSent ? "sent" : "received"}`)
      ?.focus();
  };

  if (!hasReceived && !hasSent) return null;

  return (
    <S.Section>
      <S.RequestTabs role="tablist" aria-label="그룹 요청 구분">
        {hasReceived && (
          <S.RequestTab
            type="button"
            id={`${id}-received`}
            role="tab"
            onKeyDown={handleTabKeyDown}
            aria-selected={!isSent}
            tabIndex={isSent ? -1 : 0}
            aria-controls={`${id}-received-panel`}
            onClick={() => setShowSent(false)}
          >
            받은 그룹 초대
          </S.RequestTab>
        )}
        {hasSent && (
          <S.RequestTab
            type="button"
            id={`${id}-sent`}
            role="tab"
            onKeyDown={handleTabKeyDown}
            aria-selected={isSent}
            tabIndex={isSent ? 0 : -1}
            aria-controls={`${id}-sent-panel`}
            onClick={() => setShowSent(true)}
          >
            보낸 그룹 요청
          </S.RequestTab>
        )}
      </S.RequestTabs>
      {hasSent && (
        <S.RequestTabPanel
          id={`${id}-sent-panel`}
          role="tabpanel"
          hidden={!isSent}
          aria-labelledby={`${id}-sent`}
        >
          {isSent &&
            sentRequests.map((request) => (
              <S.SentRequestItem key={request.requestId}>
                <S.RequestDefaultProfileImg />
                <S.RequestUserBox>
                  <S.RequestUsername>{request.groupName}</S.RequestUsername>
                </S.RequestUserBox>
                <S.RequestCancelActionBox>
                  <button
                    type="button"
                    disabled={cancelPending}
                    aria-label={`${request.groupName} 그룹 가입 신청 취소`}
                    onClick={() => onCancel(request.requestId)}
                  >
                    취소
                  </button>
                </S.RequestCancelActionBox>
              </S.SentRequestItem>
            ))}
        </S.RequestTabPanel>
      )}
      {hasReceived && (
        <S.RequestTabPanel
          id={`${id}-received-panel`}
          role="tabpanel"
          hidden={isSent}
          aria-labelledby={`${id}-received`}
        >
          {!isSent &&
            invitations.map((invitation) => {
              const isPending = pendingInvitationId === invitation.requestId;

              return (
                <S.RequestItem key={invitation.requestId}>
                  <S.RequestDefaultProfileImg />
                  <S.RequestUserBox>
                    <S.RequestUsername>
                      {invitation.groupName}
                    </S.RequestUsername>
                    <S.RequestIntro>
                      {invitation.inviterNickname}님의 초대
                    </S.RequestIntro>
                  </S.RequestUserBox>
                  <S.RequestActionBox>
                    <button
                      type="button"
                      disabled={isPending}
                      aria-label={`${invitation.groupName} 그룹 초대 수락`}
                      onClick={() => onAccept(invitation.requestId)}
                    >
                      수락
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      aria-label={`${invitation.groupName} 그룹 초대 거절`}
                      onClick={() => onReject(invitation.requestId)}
                    >
                      거절
                    </button>
                  </S.RequestActionBox>
                </S.RequestItem>
              );
            })}
        </S.RequestTabPanel>
      )}
    </S.Section>
  );
}

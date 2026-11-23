import { useId, useState } from "react";

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
  const isSent = sentRequests.length > 0 && (showSent || !invitations.length);

  if (!sentRequests.length && !invitations.length) return null;

  return (
    <S.Section>
      <S.RequestTabs aria-label="그룹 요청 구분">
        {invitations.length > 0 && (
          <S.RequestTab
            type="button"
            id={`${id}-received`}
            aria-pressed={!isSent}
            aria-controls={`${id}-list`}
            onClick={() => setShowSent(false)}
          >
            받은 그룹 초대
          </S.RequestTab>
        )}
        {sentRequests.length > 0 && (
          <S.RequestTab
            type="button"
            id={`${id}-sent`}
            aria-pressed={isSent}
            aria-controls={`${id}-list`}
            onClick={() => setShowSent(true)}
          >
            보낸 그룹 요청
          </S.RequestTab>
        )}
      </S.RequestTabs>
      <S.FriendList
        id={`${id}-list`}
        role="region"
        aria-labelledby={`${id}-${isSent ? "sent" : "received"}`}
      >
        {isSent
          ? sentRequests.map((request) => (
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
            ))
          : invitations.map((invitation) => {
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
      </S.FriendList>
    </S.Section>
  );
}

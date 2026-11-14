import { useId, useState } from "react";

import type { GroupJoinRequest } from "@/api/groupApi";

import GroupJoinRequestSection from "./GroupJoinRequestSection";
import * as S from "../Group.styles";

interface GroupRequestSectionProps {
  invitations: GroupJoinRequest[];
  requests: GroupJoinRequest[];
  pendingRequestId?: number | null;
  onCancel: (requestId: number) => void;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

export default function GroupRequestSection({
  invitations,
  requests,
  pendingRequestId = null,
  onCancel,
  onAccept,
  onReject,
}: GroupRequestSectionProps) {
  const [tab, setTab] = useState<"invitations" | "requests">("invitations");
  const id = useId();
  const hasInvitations = invitations.length > 0;
  const hasRequests = requests.length > 0;
  const showInvitations =
    hasInvitations && (tab === "invitations" || !hasRequests);

  if (!hasInvitations && !hasRequests) return null;

  return (
    <S.Section>
      <S.RequestTabs aria-label="그룹 요청 구분">
        {hasInvitations && (
          <S.RequestTab
            type="button"
            id={`${id}-invitations`}
            aria-pressed={showInvitations}
            aria-controls={`${id}-list`}
            onClick={() => setTab("invitations")}
          >
            초대 대기
          </S.RequestTab>
        )}
        {hasRequests && (
          <S.RequestTab
            type="button"
            id={`${id}-requests`}
            aria-pressed={!showInvitations}
            aria-controls={`${id}-list`}
            onClick={() => setTab("requests")}
          >
            가입 요청
          </S.RequestTab>
        )}
      </S.RequestTabs>
      <S.RequestList
        id={`${id}-list`}
        role="region"
        aria-labelledby={`${id}-${showInvitations ? "invitations" : "requests"}`}
      >
        {showInvitations ? (
          invitations.map((invitation) => (
            <S.RequestItem key={invitation.requestId}>
              {invitation.requesterProfileImage ? (
                <S.RequestProfileImg
                  src={invitation.requesterProfileImage}
                  alt={`${invitation.requesterNickname} 프로필 이미지`}
                />
              ) : (
                <S.RequestDefaultProfileImg />
              )}
              <S.RequestUserBox>
                <S.RequestUsername>
                  {invitation.requesterNickname}
                </S.RequestUsername>
                {invitation.requesterIntroduction && (
                  <S.RequestIntro>
                    {invitation.requesterIntroduction}
                  </S.RequestIntro>
                )}
              </S.RequestUserBox>
              <S.RequestCancelActionBox>
                <button
                  type="button"
                  disabled={pendingRequestId !== null}
                  aria-label={`${invitation.requesterNickname} 그룹 초대 취소`}
                  onClick={() => onCancel(invitation.requestId)}
                >
                  취소
                </button>
              </S.RequestCancelActionBox>
            </S.RequestItem>
          ))
        ) : (
          <GroupJoinRequestSection
            requests={requests}
            showTitle={false}
            pendingRequestId={pendingRequestId}
            onAccept={onAccept}
            onReject={onReject}
          />
        )}
      </S.RequestList>
    </S.Section>
  );
}

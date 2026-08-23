import type { GroupInvitation } from "@/api/groupApi";

import * as S from "../FriendGroup.styles";

interface GroupInvitationSectionProps {
  invitations: GroupInvitation[];
  pendingInvitationId?: number | null;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

/**
 * 내게 온 그룹 초대 목록을 렌더링
 */
export default function GroupInvitationSection({
  invitations,
  pendingInvitationId = null,
  onAccept,
  onReject,
}: GroupInvitationSectionProps) {
  return (
    <S.Section>
      <S.Title>받은 그룹 초대</S.Title>
      <S.FriendList>
        {invitations.length > 0 ? (
          invitations.map((invitation) => {
            const isPending = pendingInvitationId === invitation.requestId;

            return (
              <S.RequestItem key={invitation.requestId}>
                <S.RequestDefaultProfileImg />
                <S.RequestUserBox>
                  <S.RequestUsername>{invitation.groupName}</S.RequestUsername>
                  <S.RequestIntro>
                    {invitation.inviterNickname}님의 초대
                  </S.RequestIntro>
                </S.RequestUserBox>
                <S.RequestActionBox>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onAccept(invitation.requestId)}
                  >
                    수락
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onReject(invitation.requestId)}
                  >
                    거절
                  </button>
                </S.RequestActionBox>
              </S.RequestItem>
            );
          })
        ) : (
          <S.EmptyBox>받은 그룹 초대가 없습니다.</S.EmptyBox>
        )}
      </S.FriendList>
    </S.Section>
  );
}

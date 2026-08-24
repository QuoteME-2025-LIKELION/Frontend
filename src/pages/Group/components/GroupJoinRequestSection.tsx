import type { GroupJoinRequest } from "@/api/groupApi";

import * as S from "../Group.styles";

interface GroupJoinRequestSectionProps {
  requests: GroupJoinRequest[];
  pendingRequestId?: number | null;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

/**
 * 그룹장에게 온 그룹 가입 요청 목록을 렌더링
 */
export default function GroupJoinRequestSection({
  requests,
  pendingRequestId = null,
  onAccept,
  onReject,
}: GroupJoinRequestSectionProps) {
  if (requests.length === 0) {
    return null;
  }

  return (
    <S.Section>
      <S.Title>가입 요청</S.Title>
      <S.RequestList>
        {requests.map((request) => {
          const isProcessing = pendingRequestId !== null;

          return (
            <S.RequestItem key={request.requestId}>
              {request.requesterProfileImageUrl ? (
                <S.RequestProfileImg
                  src={request.requesterProfileImageUrl}
                  alt="프로필 이미지"
                />
              ) : (
                <S.RequestDefaultProfileImg />
              )}
              <S.RequestUserBox>
                <S.RequestUsername>
                  {request.requesterNickname}
                </S.RequestUsername>
                <S.RequestIntro>그룹 가입을 요청했어요</S.RequestIntro>
              </S.RequestUserBox>
              <S.RequestActionBox>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => onAccept(request.requestId)}
                >
                  수락
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => onReject(request.requestId)}
                >
                  거절
                </button>
              </S.RequestActionBox>
            </S.RequestItem>
          );
        })}
      </S.RequestList>
    </S.Section>
  );
}

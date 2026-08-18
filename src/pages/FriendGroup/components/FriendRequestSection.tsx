import type { FriendRequest } from "@/api/friendApi";

import * as S from "../FriendGroup.styles";

interface FriendRequestSectionProps {
  requests: FriendRequest[];
  pendingRequestId?: number | null;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

/**
 * 받은 친구 요청 목록을 렌더링
 */
export default function FriendRequestSection({
  requests,
  pendingRequestId = null,
  onAccept,
  onReject,
}: FriendRequestSectionProps) {
  return (
    <S.Section>
      <S.Title>받은 친구 요청</S.Title>
      <S.FriendList>
        {requests.length > 0 ? (
          requests.map((request) => {
            const isPending = pendingRequestId === request.requestId;

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
                  <S.RequestIntro>자기소개 문구가 적히는 자리</S.RequestIntro>
                </S.RequestUserBox>
                <S.RequestActionBox>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onAccept(request.requestId)}
                  >
                    승인
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onReject(request.requestId)}
                  >
                    거절
                  </button>
                </S.RequestActionBox>
              </S.RequestItem>
            );
          })
        ) : (
          <S.EmptyBox>받은 친구 요청이 없습니다.</S.EmptyBox>
        )}
      </S.FriendList>
    </S.Section>
  );
}

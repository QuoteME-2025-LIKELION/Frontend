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
  const receivedRequests = requests.filter(
    (request) => request.direction === "RECEIVED"
  );

  return (
    <S.Section>
      <S.Title>받은 친구 요청</S.Title>
      <S.FriendList>
        {receivedRequests.length > 0 ? (
          receivedRequests.map((request) => {
            const isPending = pendingRequestId === request.requestId;

            return (
              <S.RequestItem key={request.requestId}>
                {request.senderProfileImage ? (
                  <S.RequestProfileImg
                    src={request.senderProfileImage}
                    alt="프로필 이미지"
                  />
                ) : (
                  <S.RequestDefaultProfileImg />
                )}
                <S.RequestUserBox>
                  <S.RequestUsername>
                    {request.senderNickname}
                  </S.RequestUsername>
                  {request.senderIntroduction && (
                    <S.RequestIntro>
                      {request.senderIntroduction}
                    </S.RequestIntro>
                  )}
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
          <S.EmptyBox>
            <S.EmptyTitle>받은 친구 요청이 없습니다.</S.EmptyTitle>
          </S.EmptyBox>
        )}
      </S.FriendList>
    </S.Section>
  );
}

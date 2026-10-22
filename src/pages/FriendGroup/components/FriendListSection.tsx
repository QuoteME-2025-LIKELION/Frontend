import UserListItem from "@/components/UserListItem/UserListItem";
import { useFriendRequestsQuery } from "@/hooks/useFriendQueries";
import type { Friend } from "@/types/friend.type";

import * as S from "../FriendGroup.styles";

interface FriendListSectionProps {
  keyword: string;
  friends: Friend[];
  searchMembers: Friend[];
  friendIdSet: Set<number>;
  onDeleteFriend: (nickname: string, id: number) => void;
  onAddFriend: (nickname: string, id: number) => void;
  hideExistingFriendAction?: boolean;
}

/**
 * 내 친구 목록 또는 검색된 유저 목록을 렌더링
 */
export default function FriendListSection({
  keyword,
  friends,
  searchMembers,
  friendIdSet,
  onDeleteFriend,
  onAddFriend,
  hideExistingFriendAction = false,
}: FriendListSectionProps) {
  const {
    data: requests,
    isFetching,
    isError,
  } = useFriendRequestsQuery(Boolean(keyword));
  const sentIds = new Set(
    requests
      ?.filter((request) => request.direction === "SENT")
      .map((request) => request.receiverId)
  );
  const receivedIds = new Set(
    requests
      ?.filter((request) => request.direction === "RECEIVED")
      .map((request) => request.senderId)
  );
  const visibleUsers = keyword ? searchMembers : friends;
  const emptyText = keyword
    ? "검색 결과가 없습니다."
    : "추가된 친구가 없습니다.";

  return (
    <S.Section>
      {!keyword ? <S.Title>친구</S.Title> : <S.Title>사용자</S.Title>}
      <S.FriendList>
        {visibleUsers.length > 0 ? (
          visibleUsers.map((user) => {
            const isFriend = friendIdSet.has(user.id);
            const isSent = sentIds.has(user.id);
            const isReceived = receivedIds.has(user.id);
            const isChecking = isFetching || requests === undefined;
            const isAddDisabled = isSent || isReceived || isChecking || isError;
            const actionButton =
              keyword && !isFriend
                ? {
                    type: "add" as const,
                    text: isSent
                      ? "요청됨"
                      : isReceived
                        ? "받은 요청"
                        : isError
                          ? "확인 불가"
                          : isChecking
                            ? "확인 중"
                            : "추가",
                    disabled: isAddDisabled,
                    onClick: () => {
                      if (!isAddDisabled) onAddFriend(user.nickname, user.id);
                    },
                  }
                : keyword && hideExistingFriendAction
                  ? undefined
                  : {
                      type: "delete" as const,
                      text: "삭제",
                      onClick: () => onDeleteFriend(user.nickname, user.id),
                    };

            return (
              <UserListItem
                key={user.id}
                friend={user}
                actionButton={actionButton}
              />
            );
          })
        ) : (
          <S.EmptyBox>
            <S.EmptyTitle>{emptyText}</S.EmptyTitle>
            {!keyword && (
              <S.EmptyDescription>친구를 추가해 보세요.</S.EmptyDescription>
            )}
          </S.EmptyBox>
        )}
      </S.FriendList>
    </S.Section>
  );
}

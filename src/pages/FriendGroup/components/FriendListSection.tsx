import UserListItem from "@/components/UserListItem/UserListItem";
import type { Friend } from "@/types/friend.type";

import * as S from "../FriendGroup.styles";

interface FriendListSectionProps {
  keyword: string;
  friends: Friend[];
  searchMembers: Friend[];
  friendIdSet: Set<number>;
  onDeleteFriend: (nickname: string, id: number) => void;
  onAddFriend: (nickname: string, id: number) => void;
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
}: FriendListSectionProps) {
  const visibleUsers = keyword ? searchMembers : friends;
  const emptyText = keyword
    ? "검색 결과가 없습니다."
    : "명언을 나눌 친구가 없습니다.";

  return (
    <S.Section>
      {!keyword ? <S.Title>친구</S.Title> : <S.Title>유저</S.Title>}
      <S.FriendList>
        {visibleUsers.length > 0 ? (
          visibleUsers.map((user) => {
            const isFriend = friendIdSet.has(user.id);
            const actionButton = keyword && !isFriend
              ? {
                  type: "add" as const,
                  text: "추가",
                  onClick: () => onAddFriend(user.nickname, user.id),
                }
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
          <S.EmptyBox>{emptyText}</S.EmptyBox>
        )}
      </S.FriendList>
    </S.Section>
  );
}

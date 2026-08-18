import Button from "@/components/Button/Button";
import Search from "@/components/Search/Search";
import UserListItem from "@/components/UserListItem/UserListItem";
import type { Friend } from "@/types/friend.type";

import * as S from "../CreateGroup.styles";

interface CreateGroupInviteStepProps {
  step: number;
  keyword: string;
  friendList: Friend[];
  displayedFriends: Friend[];
  selectedFriends: number[];
  onChangeKeyword: (keyword: string) => void;
  onClearKeyword: () => void;
  onSelectFriend: (id: number) => void;
  onMoveToFriendGroup: () => void;
  onCreateGroup: () => void;
}

/**
 * 그룹 생성 3단계의 친구 검색/선택 화면을 렌더링
 */
export default function CreateGroupInviteStep({
  step,
  keyword,
  friendList,
  displayedFriends,
  selectedFriends,
  onChangeKeyword,
  onClearKeyword,
  onSelectFriend,
  onMoveToFriendGroup,
  onCreateGroup,
}: CreateGroupInviteStepProps) {
  if (step !== 3) {
    return null;
  }

  return (
    <S.Main>
      <S.TitleContainer>
        <S.TitleLine>
          <S.MTitle>
            함께할 멤버를 <br />
            초대해 보세요
          </S.MTitle>
          <S.InviteCount>{selectedFriends.length}/4</S.InviteCount>
        </S.TitleLine>
        <S.Desc>그룹의 최대 정원은 5명이에요</S.Desc>
      </S.TitleContainer>
      <Search
        placeholder="검색"
        desc={
          friendList.length === 0
            ? "아직 추가된 친구가 없습니다."
            : keyword && displayedFriends.length === 0
              ? "검색 결과가 없습니다."
              : "나의 친구 중에서만 초대할 수 있어요."
        }
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        onClear={onClearKeyword}
      />
      <S.FriendListContainer>
        <S.FriendList>
          {friendList.length > 0 ? (
            displayedFriends.map((friend) => (
              <UserListItem
                key={friend.id}
                friend={friend}
                isSelectable={true}
                isSelected={selectedFriends.includes(friend.id)}
                onSelect={() => onSelectFriend(friend.id)}
              />
            ))
          ) : (
            <S.EmptyFriendContainer>
              <S.EmptyFriendList>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4.66669 4.6665L11.3334 11.3332M11.3334 11.3332V4.6665M11.3334 11.3332H4.66669"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <button onClick={onMoveToFriendGroup}>친구 추가</button>
                <div>탭으로 이동</div>
              </S.EmptyFriendList>
              <Button title="그룹 만들기" onClick={onCreateGroup} />
            </S.EmptyFriendContainer>
          )}
        </S.FriendList>
      </S.FriendListContainer>
    </S.Main>
  );
}

import Search from "@/components/Search/Search";
import UserListItem from "@/components/UserListItem/UserListItem";
import type { Friend } from "@/types/friend.type";

import * as S from "../CreateGroup.styles";

interface CreateGroupInviteStepProps {
  step: number;
  keyword: string;
  friendList: Friend[];
  displayedFriends: Friend[];
  pendingInvites: Friend[];
  onChangeKeyword: (keyword: string) => void;
  onClearKeyword: () => void;
  onInviteFriend: (friend: Friend) => void;
  onCancelPendingInvite: (id: number) => void;
  onMoveStep: (step: number) => void;
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
  pendingInvites,
  onChangeKeyword,
  onClearKeyword,
  onInviteFriend,
  onCancelPendingInvite,
  onMoveStep,
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
        </S.TitleLine>
        <S.Desc>그룹의 최대 정원은 5명이에요</S.Desc>
      </S.TitleContainer>
      <Search
        placeholder="검색어를 입력해 주세요"
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
                actionButton={{
                  type: "invite",
                  text: "초대",
                  onClick: () => onInviteFriend(friend),
                }}
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
            </S.EmptyFriendContainer>
          )}
        </S.FriendList>
        {pendingInvites.length > 0 && (
          <S.PendingList>
            <S.PendingTitle>초대 대기</S.PendingTitle>
            {pendingInvites.map((friend) => (
              <UserListItem
                key={friend.id}
                friend={friend}
                actionButton={{
                  type: "delete",
                  text: "취소",
                  onClick: () => onCancelPendingInvite(friend.id),
                }}
              />
            ))}
          </S.PendingList>
        )}
      </S.FriendListContainer>
      <S.BottomActionBar>
        <S.ActionButton type="button" onClick={() => onMoveStep(2)}>
          뒤로가기
        </S.ActionButton>
        <S.ActionButton type="button" onClick={onCreateGroup}>
          {pendingInvites.length > 0 ? "그룹 만들기" : "건너뛰기"}
        </S.ActionButton>
      </S.BottomActionBar>
    </S.Main>
  );
}

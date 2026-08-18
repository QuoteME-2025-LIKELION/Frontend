import type { Friend } from "@/types/friend.type";

import * as S from "./UserListItem.styles";

interface UserListItemProps {
  friend: Friend;
  isSelectable?: boolean; // true면 선택 가능 - 배경색 바뀔 수 있음
  isSelected?: boolean;
  onSelect?: () => void;
  actionButton?: {
    // 우측 버튼 정보
    type: "delete" | "add" | "invite"; // 버튼 종류
    text: string; // 버튼에 표시될 텍스트 (삭제, 추가, 초대)
    onClick: () => void; // 버튼 클릭 시 실행될 함수
  };
}

/**
 * 사용자 목록에 표시되는 행 컴포넌트
 * @param props
 * @param props.friend 친구(유저) 객체
 * @param props.isSelectable 선택 가능 여부
 * @param props.isSelected 선택된 상태 여부
 * @param props.onSelect 아이템 클릭 시 실행될 함수
 * @param props.actionButton 우측 버튼 정보
 * @param props.actionButton.type 버튼 종류 (delete, add, invite)
 * @param props.actionButton.text 버튼에 표시될 텍스트
 * @param props.actionButton.onClick 버튼 클릭 시 실행될 함수
 * @example
 * <UserListItem
 *  friend={friend}
 *  isSelectable={true}
 *  isSelected={false}
 *  onSelect={() => console.log("클릭됨")}
 *  actionButton={{
 *    type="delete"
 *    text="삭제"
 *    onClick={() => alert("삭제하시겠습니까?")}
 *  }}
 * />
 */
export default function UserListItem({
  friend,
  isSelectable = false,
  isSelected = false,
  onSelect,
  actionButton,
}: UserListItemProps) {
  const { nickname, introduction, profileImage } = friend;
  const handleClick = isSelectable ? onSelect : undefined;

  let actionButtonElement = null;

  if (actionButton && !isSelectable) {
    const { type, text, onClick } = actionButton;
    const ButtonComponent =
      type === "delete"
        ? S.DeleteBtn
        : type === "add" || type === "invite"
          ? S.AddBtn
          : null;

    actionButtonElement = ButtonComponent ? (
      <ButtonComponent onClick={onClick}>{text}</ButtonComponent>
    ) : null;
  }

  return (
    <S.Container
      onClick={handleClick}
      $isSelectable={isSelectable}
      $isSelected={isSelected}
    >
      {/* 프로필 이미지 없는 유저면 회색 배경으로 (추후 favicon으로 수정될 수 있음) */}
      {profileImage ? (
        <S.ProfileImg src={profileImage} alt="프로필 이미지" />
      ) : (
        <S.DefaultProfileImg />
      )}
      <S.UserBox>
        <S.Username>{nickname}</S.Username>
        <S.Intro>{introduction}</S.Intro>
      </S.UserBox>
      <S.BtnBox>{actionButtonElement}</S.BtnBox>
    </S.Container>
  );
}

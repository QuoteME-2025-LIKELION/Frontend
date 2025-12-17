import type { Friend } from "@/types/friend.type";
import * as S from "./ListStyle";

interface ListProps {
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
 * 리스트에 뜨는 각 아이템 컴포넌트
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
 * <List
 *  profileImgUrl="https://example.com/profile.jpg"
 *  username="테스트"
 *  intro="안녕하세요"
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
export default function List({
  friend,
  isSelectable = false,
  isSelected = false,
  onSelect,
  actionButton,
}: ListProps) {
  const { nickname, introduction, profileImage } = friend;
  const handleClick = isSelectable ? onSelect : undefined;

  // 버튼 컴포넌트 렌더링
  const ActionBtn = () => {
    if (!actionButton) return null;
    if (isSelectable) return null;
    const { type, text, onClick } = actionButton;
    const ButtonComponent =
      type === "delete"
        ? S.DeleteBtn
        : type === "add" || type === "invite"
          ? S.AddBtn
          : null;
    if (!ButtonComponent) return null;
    return <ButtonComponent onClick={onClick}>{text}</ButtonComponent>;
  };

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
      <S.BtnBox>
        <ActionBtn />
      </S.BtnBox>
    </S.Container>
  );
}

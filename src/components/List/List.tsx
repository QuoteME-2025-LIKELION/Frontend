import * as S from "./ListStyle";

interface ListProps {
  profileImgUrl: string;
  username: string;
  intro: string;
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
 * @param profileImgUrl 프로필 이미지 URL
 * @param username 사용자 이름
 * @param intro 자기소개
 * @param isSelectable 선택 가능 여부
 * @param isSelected 선택된 상태 여부
 * @param onSelect 아이템 클릭 시 실행될 함수
 * @param actionButton 우측 버튼 정보
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
  profileImgUrl,
  username,
  intro,
  isSelectable = false,
  isSelected = false,
  onSelect,
  actionButton,
}: ListProps) {
  const handleClick = isSelectable ? onSelect : undefined;

  // 버튼 컴포넌트 렌더링
  const ActionBtn = () => {
    if (!actionButton) return null;
    const { type, text, onClick } = actionButton;
    const ButtonComponent =
      type === "delete"
        ? S.DeleteBtn
        : type === "add" || type === "invite"
          ? S.AddBtn
          : null;
    if (!ButtonComponent) return null;
    return (
      <ButtonComponent onClick={onClick} $isSelected={isSelected}>
        {text}
      </ButtonComponent>
    );
  };

  return (
    <S.Container
      onClick={handleClick}
      $isSelectable={isSelectable}
      $isSelected={isSelected}
    >
      <S.ProfileImg src={profileImgUrl} alt="프로필 이미지" />
      <S.UserBox>
        <S.Username>{username}</S.Username>
        <S.Intro>{intro}</S.Intro>
      </S.UserBox>
      <S.BtnBox>
        <ActionBtn />
      </S.BtnBox>
    </S.Container>
  );
}

import * as S from "./HeaderStyle";

interface HeaderProps {
  showBackBtn: boolean;
  showXBtn: boolean;
  title: string;
  backgroundColor: "primary" | "secondary" | "white";
  onClickBackBtn?: () => void;
  onClickXBtn?: () => void;
}

/**
 * 헤더 컴포넌트
 * @param props
 * @param props.showBackBtn 뒤로가기 버튼 표시 여부 (닫기 버튼과 함께 표시될 수 없음)
 * @param props.showXBtn 닫기 버튼 표시 여부 (뒤로가기 버튼과 함께 표시될 수 없음)
 * @param props.title 헤더 제목
 * @param props.backgroundColor 배경 색상 (primary: 남색, secondary: 연회색, white: 흰색)
 * @param props.onClickBackBtn 뒤로가기 버튼 클릭 시 호출되는 함수
 * @param props.onClickXBtn 닫기 버튼 클릭 시 호출되는 함수
 * @example
 * <Header
 *  showBackBtn={true}
 *  showXBtn={false}
 *  title="페이지 제목"
 *  backgroundColor="white"
 *  onClickBackBtn={() => { console.log("뒤로가기 클릭") }}
 * />
 */
export default function Header({
  showBackBtn,
  showXBtn,
  title,
  backgroundColor = "white",
  onClickBackBtn,
  onClickXBtn,
}: HeaderProps) {
  return (
    <S.Wrapper $backgroundColor={backgroundColor}>
      <S.Container>
        {showBackBtn ? (
          <button onClick={onClickBackBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke={backgroundColor === "primary" ? "#fff" : "#000"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : showXBtn ? (
          <button onClick={onClickXBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke={backgroundColor === "primary" ? "#fff" : "black"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
        <div>{title}</div>
        <S.Div></S.Div>
      </S.Container>
    </S.Wrapper>
  );
}

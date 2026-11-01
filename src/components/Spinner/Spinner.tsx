import * as S from "./Spinner.styles";

/**
 * 로딩 스피너 컴포넌트
 */
export default function Spinner() {
  return (
    <S.SpinnerContainer role="status" aria-atomic="true">
      <S.LoadingText>불러오는 중입니다.</S.LoadingText>
      <S.Spinner aria-hidden="true" />
    </S.SpinnerContainer>
  );
}

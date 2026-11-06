import VisuallyHidden from "@/components/VisuallyHidden/VisuallyHidden";

import * as S from "./Spinner.styles";

/**
 * 로딩 스피너 컴포넌트
 */
export default function Spinner() {
  return (
    <S.SpinnerContainer role="status" aria-atomic="true">
      <VisuallyHidden>불러오는 중입니다.</VisuallyHidden>
      <S.Spinner aria-hidden="true" />
    </S.SpinnerContainer>
  );
}

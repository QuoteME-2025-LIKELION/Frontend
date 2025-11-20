import * as S from "./ToastModalStyle";

interface ToastModalProps {
  showOverlay?: boolean;
  text: string;
  redText?: string;
  text2?: string;
  text3?: string;
}

/**
 * 알림 형태로 잠깐 떴다가 사라지는 모달 컴포넌트
 * 실제 페이지에 사용할 땐 isVisible 등의 상태로 조건부 렌더링
 * @param props
 * @param props.text - 모달에 표시될 텍스트 (빨간색이 아닌 부분)
 * @param props.redText - 모달에 표시될 빨간색 텍스트 (선택 사항)
 * @param props.text2 - 빨간색 텍스트 옆으로 올 텍스트 (빨간색이 아닌 부분, 선택 사항)
 * @param props.text3 - 다음 줄에 올 텍스트 (빨간색이 아닌 부분, 선택 사항)
 */
export default function ToastModal({
  showOverlay = true,
  text,
  redText,
  text2,
  text3,
}: ToastModalProps) {
  return (
    <S.Overlay $showOverlay={showOverlay}>
      <S.Container>
        <div>
          {text}&nbsp;{redText && <S.RedText>{redText}</S.RedText>}
          {text2 && text2}
        </div>
        <div>{text3 && text3}</div>
      </S.Container>
    </S.Overlay>
  );
}

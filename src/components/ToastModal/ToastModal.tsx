import { useEffect } from "react";
import * as S from "./ToastModalStyle";

interface ToastModalProps {
  isVisible: boolean;
  onClose: () => void;
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
 * @param props.isVisible - 모달의 표시 여부 (조건부 렌더링용. useState 등으로 관리)
 * @param props.onClose - 모달이 닫힐 때 호출될 함수 (setState(false) 등)
 * @param props.showOverlay - 모달 뒤에 오버레이를 표시할지 여부 (기본값 true)
 * @param props.text - 모달에 표시될 텍스트 (빨간색이 아닌 부분)
 * @param props.redText - 모달에 표시될 빨간색 텍스트 (선택 사항)
 * @param props.text2 - 빨간색 텍스트 옆으로 올 텍스트 (빨간색이 아닌 부분, 선택 사항)
 * @param props.text3 - 다음 줄에 올 텍스트 (빨간색이 아닌 부분, 선택 사항)
 * @example
 * <ToastModal
 *  isVisible={showToast}
 *  text="그룹원이"
 *  redText="5인을 초과"
 *  text2="하여"
 *  text3="초대가 불가능합니다."
 *  showOverlay={false}
 * />
 */
export default function ToastModal({
  isVisible,
  onClose,
  showOverlay = true,
  text,
  redText,
  text2,
  text3,
}: ToastModalProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500); // 1.5초 후에 모달 닫기

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;
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

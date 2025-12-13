import { useState } from "react";
import * as S from "./ConfirmModalStyle";

interface ConfirmModalProps {
  question: string;
  onClose: () => void;
  onConfirm: () => void;
  nickname?: string;
  nickname2?: string;
  question2?: string;
  showOverlay?: boolean;
}

/**
 * 취소, 확인 버튼이 있는 모달 컴포넌트
 * 실제 페이지에 사용할 땐 isVisible 등의 상태로 조건부 렌더링
 * @param props
 * @param props.question - 모달에 표시될 질문 텍스트
 * @param props.onClose - 모달 외부 및 취소 버튼 클릭 시 호출되는 모달 닫기 함수 (setIsVisible(false) 등)
 * @param props.onConfirm - 확인 버튼 클릭 시 호출되는 함수
 * @param props.nickname - 텍스트 중 앞쪽에 표시될 닉네임 or 그룹명 (선택 사항)
 * @param props.nickname2 - 텍스트 중 뒤쪽에 표시될 닉네임 or 그룹명 (선택 사항)
 * @param props.question2 - nickname2가 있을 때 그 뒤에 표시될 질문 텍스트 (선택 사항)
 * @param props.showOverlay - 오버레이 표시 여부 (기본값: true)
 * @example
 * <ConfirmModal
 *   nickname="듀듀"
 *   question="님을"
 *   nickname2="무니니"
 *   question2="에 초대할까요?"
 *   onClose={() => {}}
 *   onConfirm={() => {}}
 * />
 */
export default function ConfirmModal({
  question,
  onClose,
  onConfirm,
  nickname,
  nickname2,
  question2,
  showOverlay = true,
}: ConfirmModalProps) {
  // 모달 영역을 클릭해도 onClose가 호출되지 않도록 이벤트 버블링을 막음
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // 애니메이션 시간(0.3초)과 동일하게 설정
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };
  return (
    <S.Overlay $showOverlay={showOverlay} onClick={handleClose}>
      <S.Container $isClosing={isClosing} onClick={stopPropagation}>
        <S.Question>
          {nickname && <div>{nickname}</div>}
          {question}&nbsp;{nickname2 && <div>{nickname2}</div>}
          {question2 && question2}
        </S.Question>
        <S.BtnBox>
          <S.Btn type="button" onClick={handleClose}>
            취소
          </S.Btn>
          <S.Div></S.Div>
          <S.Btn type="button" onClick={handleConfirm}>
            확인
          </S.Btn>
        </S.BtnBox>
      </S.Container>
    </S.Overlay>
  );
}

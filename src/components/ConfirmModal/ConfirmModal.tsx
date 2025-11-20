import * as S from "./ConfirmModalStyle";

interface ConfirmModalProps {
  question: string;
  onCancel: () => void;
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
 * @param props.onCancel - 취소 버튼 클릭 시 호출되는 함수
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
 *   onCancel={() => {}}
 *   onConfirm={() => {}}
 * />
 */
export default function ConfirmModal({
  question,
  onCancel,
  onConfirm,
  nickname,
  nickname2,
  question2,
  showOverlay = true,
}: ConfirmModalProps) {
  return (
    <S.Overlay $showOverlay={showOverlay}>
      <S.Container>
        <S.Question>
          {nickname && <div>{nickname}</div>}
          {question}&nbsp;{nickname2 && <div>{nickname2}</div>}
          {question2 && question2}
        </S.Question>
        <S.BtnBox>
          <S.Btn type="button" onClick={onCancel}>
            취소
          </S.Btn>
          <S.Div></S.Div>
          <S.Btn type="button" onClick={onConfirm}>
            확인
          </S.Btn>
        </S.BtnBox>
      </S.Container>
    </S.Overlay>
  );
}

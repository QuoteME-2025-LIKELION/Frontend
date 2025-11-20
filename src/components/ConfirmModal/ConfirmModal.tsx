import * as S from "./ConfirmModalStyle";

interface ConfirmModalProps {
  question: string;
  onCancel: () => void;
  onConfirm: () => void;
  nickName?: string;
}

/**
 * 취소, 확인 버튼이 있는 모달 컴포넌트
 * 실제 페이지에 사용할 땐 isVisible 등의 상태로 조건부 렌더링
 * @param props
 * @param props.question - 모달에 표시될 질문 텍스트
 * @param props.onCancel - 취소 버튼 클릭 시 호출되는 함수
 * @param props.onConfirm - 확인 버튼 클릭 시 호출되는 함수
 * @param props.nickName - 질문 앞에 표시될 닉네임 or 그룹명 (선택 사항)
 */
export default function ConfirmModal({
  question,
  onCancel,
  onConfirm,
  nickName,
}: ConfirmModalProps) {
  return (
    <S.Overlay>
      <S.Container>
        <S.Question>
          <div>{nickName}</div>
          {question}
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

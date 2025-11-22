import * as S from "./ButtonStyle";

interface ButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * 버튼 컴포넌트
 * @param props
 * @param props.title 버튼에 표시될 텍스트
 * @param props.onClick 버튼 클릭 시 호출되는 함수
 * @param props.disabled 버튼 비활성화 여부
 * @example
 * <Button
 *  title="입력 완료"
 *  onClick={() => console.log("클릭됨")}
 * />
 */
export default function Button({ title, onClick, disabled }: ButtonProps) {
  return (
    <S.Button onClick={onClick} disabled={disabled}>
      {title}
    </S.Button>
  );
}

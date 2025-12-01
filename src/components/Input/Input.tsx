import * as S from "./InputStyle";

interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  hideSpin?: boolean;
}

/**
 * 입력창 컴포넌트 - props는 상황에 따라 추가 가능
 * @param props
 * @param props.value 입력창의 값
 * @param props.onChange 입력창 값 변경 시 호출되는 함수
 * @param props.placeholder 입력창의 placeholder 텍스트
 * @param props.type 입력창의 타입 (text, email, password, number 등)
 * @param props.name 입력창의 이름
 * @param props.disabled 입력창 비활성화 여부
 * @param props.readOnly 입력창 읽기 전용 여부
 * @param props.required 입력창 필수 입력 여부
 * @param props.minLength 입력창의 최소 입력 길이
 * @param props.maxLength 입력창의 최대 입력 길이
 * @param props.hideSpin 숫자 input에서 기본 스핀 버튼을 숨길지 여부
 * @example
 * <Input
 *  value={email}
 *  onChange={(e) => setEmail(e.target.value)}
 *  placeholder="이메일 입력"
 *  type="email"
 *  name="email"
 *  required={true}
 * />
 */
export default function Input({
  value,
  onChange,
  placeholder,
  type,
  name,
  disabled,
  readOnly,
  required,
  minLength,
  maxLength,
  hideSpin,
}: InputProps) {
  return (
    <S.Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      name={name}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      hideSpin={hideSpin} 
    />
  );
}

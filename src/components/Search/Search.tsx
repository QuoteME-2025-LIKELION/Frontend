import * as S from "./SearchStyle";

interface SearchProps {
  placeholder?: string;
  desc?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  onClear?: () => void;
}

/**
 * 검색창 컴포넌트
 * @param props
 * @param props.placeholder - 검색창의 placeholder 텍스트
 * @param props.desc - 검색창 아래에 표시되는 설명 텍스트
 * @param props.value - 검색창의 값
 * @param props.onChange - 검색창 값 변경 시 호출되는 함수
 * @param props.type - 검색창의 타입 (기본값 text)
 * @param props.name - 검색창의 이름
 * @param props.disabled - 검색창 비활성화 여부
 * @param props.readOnly - 검색창 읽기 전용 여부
 * @param props.required - 검색창 필수 입력 여부
 * @param props.minLength - 검색창의 최소 입력 길이
 * @param props.maxLength - 검색창의 최대 입력 길이
 * @param props.onClear - X 버튼 클릭 시 호출되는 함수 (setValue("") 이런 식으로 구현)
 * @example
 * <Search
 *  placeholder="검색"
 *  desc="이메일, 닉네임, 그룹명으로 계정을 검색할 수 있어요."
 *  value={text}
 *  onChange={(e) => setText(e.target.value)}
 *  name="text"
 *  onSearch={() => console.log("검색됨")}
 *  onClear={() => console.log("삭제됨")}
 * />
 */
export default function Search({
  placeholder,
  desc,
  value,
  onChange,
  type = "text",
  name,
  disabled,
  readOnly,
  required = true,
  minLength,
  maxLength,
  onClear,
}: SearchProps) {
  return (
    <S.Wrapper>
      <S.Container>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M14 14L11.1067 11.1067M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
            stroke="#959595"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <S.SearchInput
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
        />
        {value && onClear && (
          <button type="button" onClick={onClear}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clipPath="url(#clip0_636_1003)">
                <path
                  d="M10 6L6.00004 10M6.00004 6L10 10M14.6667 8C14.6667 11.6819 11.6819 14.6667 8.00004 14.6667C4.31814 14.6667 1.33337 11.6819 1.33337 8C1.33337 4.3181 4.31814 1.33334 8.00004 1.33334C11.6819 1.33334 14.6667 4.3181 14.6667 8Z"
                  stroke="#959595"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_636_1003">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        )}
      </S.Container>
      {desc && <S.Desc>{desc}</S.Desc>}
    </S.Wrapper>
  );
}

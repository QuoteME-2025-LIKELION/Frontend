import { useId, useImperativeHandle, useRef } from "react";
import type { ComponentPropsWithRef } from "react";

import theme from "@/styles/theme";

import * as S from "./Search.styles";

interface SearchProps extends Omit<ComponentPropsWithRef<"input">, "children"> {
  label: string;
  value?: string;
  desc?: string;
  onClear?: () => void;
}

/** 입력 이름·설명을 연결하고 검색어를 지운 뒤 입력으로 초점을 돌려준다. */
export default function Search({
  label,
  desc,
  value,
  type = "text",
  required = true,
  disabled,
  readOnly,
  onClear,
  id,
  ref,
  "aria-describedby": describedBy,
  ...inputProps
}: SearchProps) {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const descriptionId = `${generatedId}-description`;
  const clearClipId = `${generatedId}-clear-icon`;
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionIds =
    [describedBy, desc ? descriptionId : undefined].filter(Boolean).join(" ") ||
    undefined;

  useImperativeHandle(ref, () => inputRef.current!, []);

  const handleClear = () => {
    if (disabled || readOnly) return;

    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <S.Wrapper>
      <S.Container>
        <svg
          aria-hidden="true"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M14 14L11.1067 11.1067M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
            stroke={theme.colors.territory}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <S.SearchInput
          {...inputProps}
          ref={inputRef}
          id={inputId}
          aria-label={label}
          aria-describedby={descriptionIds}
          value={value}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
        />
        {value && onClear && (
          <button
            type="button"
            aria-label="검색어 지우기"
            aria-controls={inputId}
            disabled={disabled || readOnly}
            onClick={handleClear}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clipPath={`url(#${clearClipId})`}>
                <path
                  d="M10 6L6.00004 10M6.00004 6L10 10M14.6667 8C14.6667 11.6819 11.6819 14.6667 8.00004 14.6667C4.31814 14.6667 1.33337 11.6819 1.33337 8C1.33337 4.3181 4.31814 1.33334 8.00004 1.33334C11.6819 1.33334 14.6667 4.3181 14.6667 8Z"
                  stroke={theme.colors.territory}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id={clearClipId}>
                  <rect width="16" height="16" fill={theme.colors.white} />
                </clipPath>
              </defs>
            </svg>
          </button>
        )}
      </S.Container>
      {desc && <S.Desc id={descriptionId}>{desc}</S.Desc>}
    </S.Wrapper>
  );
}

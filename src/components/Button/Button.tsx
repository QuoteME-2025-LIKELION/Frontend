import type { ComponentPropsWithRef } from "react";

import * as S from "./Button.styles";

interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "title"> {
  title: string;
  font?: "batang" | "pretendard";
  bgColor?: string;
  fontcolor?: string;
  border?: string;
  disableActive?: boolean;
}

/** 일반 동작은 button, 폼 제출은 명시적으로 type="submit"을 사용한다. */
export default function Button({
  title,
  children,
  type = "button",
  font = "batang",
  bgColor,
  fontcolor,
  border,
  disableActive = false,
  ...props
}: ButtonProps) {
  return (
    <S.Button
      {...props}
      type={type}
      $font={font}
      $bgColor={bgColor}
      $fontColor={fontcolor}
      $border={border}
      $disableActive={disableActive}
    >
      <S.ButtonContent>
        {children}
        <span>{title}</span>
      </S.ButtonContent>
    </S.Button>
  );
}

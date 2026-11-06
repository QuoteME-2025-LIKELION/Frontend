import type { ComponentPropsWithRef } from "react";

import * as S from "./Input.styles";

interface InputProps extends ComponentPropsWithRef<"input"> {
  hideSpin?: boolean;
}

/** 기본 입력 속성, 접근성 속성, ref를 실제 input에 전달한다. */
export default function Input({ hideSpin, ...props }: InputProps) {
  return <S.Input {...props} $hideSpin={hideSpin} />;
}

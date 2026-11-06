import type { ChangeEvent, CompositionEvent } from "react";

export const countCodePoints = (value: string) => Array.from(value).length;
export const sliceCodePoints = (value: string, limit: number) =>
  Array.from(value).slice(0, limit).join("");

/** 한글 조합 중에는 자르지 않고 조합 완료 시 입력 한도를 적용한다. */
export function codePointInputProps(onChange: (value: string) => void, limit: number) {
  return {
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.currentTarget.value;
      onChange((event.nativeEvent as InputEvent).isComposing ? value : sliceCodePoints(value, limit));
    },
    onCompositionEnd: (event: CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(sliceCodePoints(event.currentTarget.value, limit));
    },
  };
}

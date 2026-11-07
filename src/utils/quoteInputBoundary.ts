import { countCodePoints, sliceCodePoints } from "./codePoint";

/** 선택 영역 위치는 UTF-16 단위, 입력 가능 글자 수는 코드포인트 단위로 계산한다. */
export function fitQuoteInsertion(value: string, start: number, end: number, text: string, limit: number) {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const available = Math.max(0, limit - countCodePoints(before + after));
  const insertion = sliceCodePoints(text.replace(/\r\n?/g, "\n"), available);
  return { value: before + insertion + after, caret: before.length + insertion.length };
}

/** 네이티브 beforeinput 이벤트로 입력 종류와 사전 취소 가능 여부를 확인한다. */
export function bindQuoteInputBoundary(
  field: HTMLTextAreaElement,
  onChange: (value: string) => void,
  limit: number,
) {
  const beforeInput = (event: InputEvent) => {
    // 한글 조합을 중간에 자르면 입력이 깨질 수 있으므로 조합 완료 시 기존 제한을 적용한다.
    if (!event.cancelable || event.isComposing || !event.inputType.startsWith("insert")) return;
    const text = event.inputType === "insertLineBreak" || event.inputType === "insertParagraph"
      ? "\n" : event.data;
    if (text === null) return;
    const next = field.value.slice(0, field.selectionStart) + text + field.value.slice(field.selectionEnd);
    if (countCodePoints(next) > limit) event.preventDefault();
  };
  const paste = (event: ClipboardEvent) => {
    if (!event.clipboardData) return;
    event.preventDefault();
    const next = fitQuoteInsertion(field.value, field.selectionStart, field.selectionEnd,
      event.clipboardData.getData("text/plain"), limit);
    field.value = next.value;
    field.setSelectionRange(next.caret, next.caret);
    onChange(next.value);
  };
  field.addEventListener("beforeinput", beforeInput);
  field.addEventListener("paste", paste);
  return () => {
    field.removeEventListener("beforeinput", beforeInput);
    field.removeEventListener("paste", paste);
  };
}

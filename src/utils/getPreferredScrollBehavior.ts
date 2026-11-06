/** 명시적 JS 스크롤도 기기의 동작 줄이기 설정을 따른다. */
export function getPreferredScrollBehavior(): ScrollBehavior {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

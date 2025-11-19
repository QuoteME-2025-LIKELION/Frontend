// 앱 전체에서 사용되는 테마 정의

/**
 * 앱 전체에서 사용되는 테마 정의. theme를 import해서 쓰시면 됩니다.
 * (import할 때 import { theme as t } 처럼 별칭을 쓰는 것도 가능합니다.)
 * @example
 * // 컴포넌트 스타일 파일 내부
 * const Container = style.div`
 *  ${theme.fonts.dotum} // 폰트는 이렇게만 써도 됨
 *  color: ${theme.colors.primary};
 * `
 */
const theme = {
  // 추가 예정
  colors: {
    primary: "#143858",
    secondary: "#f3f3f3",
  },
  // 아예 font-family 자체를 관리
  fonts: {
    dotum:
      "font-family: 'KoPubWorldDotum', 'Noto Sans', sans-serif; line-height: 1;",
    batang: "font-family: 'KoPubWorldBatang', serif; line-height: 1;",
  },
} as const;

export type ThemeType = typeof theme;

export default theme;

// 앱 전체에서 사용되는 테마 정의

/**
 * 앱 전체에서 사용되는 테마 정의. theme를 import해서 쓰시면 됩니다.
 * (import할 때 import { theme as t } 처럼 별칭을 쓰는 것도 가능합니다.)
 * @example
 * // 컴포넌트 스타일 파일 내부
 * const Container = style.div`
 *  ${theme.fonts.pretendard} // 폰트는 이렇게만 써도 됨
 *  color: ${theme.colors.primary};
 * `
 */
const theme = {
  colors: {
    primary: "#143858",
    secondary: "#e9eaec",
    territory: "#959595",
    red: "#de1c1c",

    "grey-00": "#fafafa",
    "grey-50": "#e9eaec",
    "grey-100": "#dadbde",
    "grey-200": "#c3c5c9",
    "grey-300": "#abaeb5",
    "grey-400": "#9599a1",
    "grey-500": "#7d828c",
    "grey-600": "#71757f",
    "grey-700": "#575c67",
    "grey-800": "#444954",
    "grey-900": "#323740",
    "grey-950": "#21242b",

    "indigo-50": "#edf2f7",
    "indigo-100": "#cedae5",
    "indigo-200": "#aec2d4",
    "indigo-300": "#8cabc6",
    "indigo-400": "#6a93b7",
    "indigo-500": "#4a7ba6",
    "indigo-600": "#396b96",
    "indigo-700": "#2c5a83",
    "indigo-800": "#20496d",
    "indigo-900": "#143858",
    "indigo-950": "#0d283f",

    "red-50": "#f9ebed",
    "red-100": "#efc4c9",
    "red-200": "#e79ca4",
    "red-300": "#e0727f",
    "red-400": "#da4657",
    "red-500": "#cc2438",
    "red-600": "#b6192b",
    "red-700": "#9f1020",
    "red-800": "#850917",
    "red-900": "#6a030f",
    "red-950": "#4d0009",

    white: "#ffffff",
    black: "#000000",
  },
  // 아예 font-family 자체를 관리
  fonts: {
    batang: "font-family: 'KoPubWorldBatang', serif; line-height: 1;",
    pretendard:
      "font-family: 'Pretendard Variable','Noto Sans KR', sans-serif; line-height: 1;",
    bombaram: "font-family: 'HSBombaram', serif; line-height: 1;",
  },
} as const;

export type ThemeType = typeof theme;

export default theme;

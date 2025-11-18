// 앱 전체에서 사용되는 테마 정의

import type { Theme } from "@emotion/react";

/**
 * 앱 전체에서 사용되는 테마 정의. theme를 import해서 쓰시면 됩니다.
 * (import할 때 import { theme as t } 처럼 별칭을 쓰는 것도 가능합니다.)
 * @example
 * // 컴포넌트 스타일 파일 내부
 * const Container = style.div`
 *  color: ${theme.colors.primary};
 * `
 */
const theme: Theme = {
  // 추가 예정
  colors: {},
} as const;

export type ThemeType = typeof theme;

export default theme;

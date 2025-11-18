// 커스텀 테마 타입을 Emotion의 Theme 인터페이스에 병합

import type { ThemeType } from "@/styles/theme";
import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme extends ThemeType {}
}

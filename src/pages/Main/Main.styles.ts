import styled from "@emotion/styled";

import { shortViewport } from "@/styles/responsive";
import theme from "@/styles/theme";

export const Container = styled.div`
  background-color: ${theme.colors.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100dvh;
  min-height: 100dvh;
  overflow: hidden;
  position: relative;

  ${shortViewport} {
    > :not([data-page-scroll]) {
      flex-shrink: 0;
    }
  }
`;

// 충분한 높이에서는 기존 flex 배치에 별도 박스를 추가하지 않는다.
export const ScrollContent = styled.div`
  display: contents;

  ${shortViewport} {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
`;

import styled from "@emotion/styled";

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
`;

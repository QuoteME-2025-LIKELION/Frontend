import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  min-height: 100dvh;
  background: ${theme.colors.secondary};
`;
export const List = styled.div`
  padding: 1.5rem;
  button { text-decoration: none; }
`;
export const Empty = styled.p`
  margin: 3rem 0;
  text-align: center;
  ${theme.fonts.pretendard}
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${theme.colors.territory};
`;

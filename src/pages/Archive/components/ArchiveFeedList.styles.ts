import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  padding: 0 1.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.primary};
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const EmptyMessage = styled.p`
  margin: 8rem 0 0;
  ${theme.fonts.batang}
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.32px;
  text-align: center;
`;

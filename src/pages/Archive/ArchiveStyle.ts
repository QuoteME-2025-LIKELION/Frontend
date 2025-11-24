import theme from "@/styles/theme";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  background-color: ${theme.colors.secondary};
  height: 100vh;
`;

export const Menu = styled.div`
  width: 100%;
  background-color: ${theme.colors.secondary};
  padding: 1.25rem 3rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Btn = styled.button<{ $active: boolean }>`
  padding: 0.3125rem 0.9375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: transparent;

  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.32px;

  ${({ $active }) =>
    $active &&
    css`
      background-color: #fff;
      color: #000;
      border-top: 1px solid rgba(0, 0, 0, 0.55);
      border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    `}
`;

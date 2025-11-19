import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Button = styled.button`
  width: 100%;
  height: 1.875rem; /* 30px */
  background-color: #fff;
  border-top: 0.5px solid ${theme.colors.territory};
  border-bottom: 0.5px solid ${theme.colors.territory};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4375rem 0.625rem; /* 7px 10px */

  ${theme.fonts.batang}
  color: #000;
  font-size: 1rem; /* 16px */
  font-weight: 700;
  letter-spacing: -0.32px;
  text-align: center;

  /* 임의로 추가 */
  &:active {
    background-color: ${theme.colors.secondary};
  }
`;

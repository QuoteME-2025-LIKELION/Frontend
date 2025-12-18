import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  background-color: #fff;
  height: 100%;
  padding: 0 0.9375rem; /* 0 15px */
  margin-top: 54%;

  @media screen and (max-width: 360px) {
    padding: 0 1.25rem; /* 0 20px */
  }
`;

export const Content = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SorryBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 1.5rem; /* 20px */
  left: 1rem;
  gap: 0.625rem; /* 10px */
  background-color: #fff;
  padding-right: 0.6125rem; /* 10px */

  ${theme.fonts.chonburi}
  color: ${theme.colors.primary};
  text-align: center;
  font-weight: 400;

  @media screen and (max-width: 360px) {
    left: -0.5rem;
  }
`;

export const SorryText = styled.div`
  font-size: 1.25rem; /* 20px */
  letter-spacing: -0.4px;
`;

export const Sorry503 = styled.div`
  font-size: 2.5rem; /* 40px */
  letter-spacing: -0.8px;
`;

export const Main = styled.div`
  width: 100%;
  padding: 4.5rem 3.125rem 0; /* 72px 50px 0 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 360px) {
    padding: 4.5rem 1.25rem 0; /* 72px 20px 0 */
  }
`;

export const TextBox = styled.div`
  background-color: #fff;
  padding: 0.5625rem 0; /* 9px 0 */
  border-top: 1px solid ${theme.colors.primary};
  border-bottom: 1px solid ${theme.colors.primary};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.fonts.batang}
  color: ${theme.colors.primary};
  font-size: 0.875rem; /* 14px */
  letter-spacing: -0.28px;
  font-weight: 500;
`;

export const Div = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.colors.primary};
  margin-top: 2.125rem; /* 34px */
  margin-bottom: 1.25rem; /* 20px */
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${theme.fonts.batang}
  color: ${theme.colors.primary};
  font-size: 0.75rem; /* 12px */
  letter-spacing: -0.24px;
  font-weight: 500;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* 8px */
  }
`;

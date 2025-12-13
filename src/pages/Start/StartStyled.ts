import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  background-color: ${() => theme.colors.primary};
  height: 100vh;
  justify-content: center;
`;

export const TextBox = styled.div``;
export const TitleText = styled.div`
  ${theme.fonts.chonburi};
  font-size: 48px;
  color: #fff;
  text-align: center;
  font-weight: 400;
  line-height: 100%;
  padding-bottom: 30px;
`;
export const Text = styled.div`
  ${theme.fonts.pretendard};
  color: #fff;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  margin-bottom: 21px;
`;

export const BtnBox = styled.div`
  width: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.875rem; /* 14px */
`;

export const Button = styled.button`
  width: 100%;
  height: 2.6875rem; /* 43px */
  background-color: #fff;
  border-top: 0.5px solid ${theme.colors.territory};
  border-bottom: 0.5px solid ${theme.colors.territory};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4375rem 0.625rem; /* 7px 10px */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

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

export const ButtonText = styled.div`
  ${theme.fonts.batang};
  color: #000;
  text-align: center;
  font-weight: 700;
`;

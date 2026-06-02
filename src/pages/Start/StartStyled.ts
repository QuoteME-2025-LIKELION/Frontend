import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${() => theme.colors.primary};
  height: 100vh;
  position: relative;
`;

export const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;
export const TitleText = styled.div`
  ${theme.fonts.batang};
  font-size: 48px;
  color: #fff;
  text-align: center;
  font-weight: 400;
  line-height: 100%;
  padding-bottom: 12px;
`;
export const Text = styled.div`
  ${theme.fonts.pretendard};
  color: #fff;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -0.28px;
`;

export const BtnBox = styled.div`
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.875rem; /* 14px */
  margin-top: auto;
  margin-bottom: 34px;
`;

export const Button = styled.button`
  width: 100%;
  height: 2.6875rem; /* 43px */
  background-color: #fff;
  border-top: 0.5px solid ${theme.colors.territory};
  border-bottom: 0.5px solid ${theme.colors.territory};
  display: flex;
  justify-self: self-end;
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

export const LogButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  background: var(--bg-overlay, rgba(33, 36, 43, 0.45));
`;
export const Loginbox = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);

  width: 100%;
  max-width: 393px;
  box-sizing: border-box;

  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  background: #fff;
  z-index: 11;
  border-radius: var(--spacing-radius-md, 12px) var(--spacing-radius-md, 12px) 0
    0;
  background: var(--bg-basement-neutral, #e9eaec);

  /* global-shadow */
  box-shadow: 0 0 10px 0 rgba(20, 56, 88, 0.16);
`;

import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
`;

export const InputBox = styled.div`
  width: 100%;
  padding: 0 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

export const WarningMessage = styled.div`
  display: flex;
  justify-content: center;
  color: ${theme.colors.red};
  font-size: 13px;
  font-weight: 400;
  ${theme.fonts.pretendard};
  letter-spacing: -0.26px;
`;

export const BtnBox = styled.div`
  margin-top: 5.875rem;
  width: 100%;
  padding: 0 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

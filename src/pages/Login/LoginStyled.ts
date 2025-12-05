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
  width: 315px;
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
`;

export const InputBtn = styled.div`
  ${theme.fonts.batang};
  border-top: 0.5px solid ${theme.colors.territory};
  border-bottom: 0.5px solid ${theme.colors.territory};
  background: #fff;
  display: flex;
  padding: 7px 10px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  align-self: stretch;
  margin-top: 81px;
  cursor: pointer;
`;

export const MissingBtn = styled.button`
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  text-align: center;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  text-decoration-line: underline;
  text-underline-position: from-font;
`;

import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  background-color: ${() => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
`;

export const ComendList = styled.div`
  padding: 20px 25px;
  gap: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Head = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 26px;
`;

export const Text = styled.div`
  color: #000;
  ${theme.fonts.batang}
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  letter-spacing: -0.4px;
  white-space: pre-line;
`;

export const TitleText = styled(Text)`
  font-size: 20px;
`;

export const QuoteText = styled(Text)`
  width: 250px;
  font-size: 16px;
`;

export const AuthorText = styled(Text)`
  font-size: 12px;
`;

export const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

export const UsageRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
`;

export const UsageText = styled.div`
  ${theme.fonts.pretendard}
  color: #0a4f83;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 120%;
`;

export const Commend = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #143858;
  background: #fff;
  gap: 15px;
  cursor: pointer;

  border: ${({ $isSelected }) =>
    $isSelected ? "1px solid #143858;" : "1px solid #959595;"};
`;

export const FirstLine = styled.div`
  display: flex;
  gap: 18px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const StatusText = styled(Text)`
  width: 100%;
  min-height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  color: ${theme.colors.territory};
  font-size: 0.875rem;
`;

export const BtnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  margin-top: 24px;
`;

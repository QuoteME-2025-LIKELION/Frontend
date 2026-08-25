import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  background-color: ${() => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  flex: 1;
  min-height: 0;
  padding-top: 1.5rem;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
`;

export const ComendList = styled.div`
  flex: 1;
  padding: 1.125rem 1.5rem 2.4375rem;
  gap: 0.875rem;
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
  gap: 0;
  margin-top: 0;
`;

export const Text = styled.div`
  color: #000;
  ${theme.fonts.batang}
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  letter-spacing: 0;
  white-space: pre-line;
`;

export const TitleText = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  line-height: 120%;
`;

export const QuoteText = styled(Text)<{ $isSelected?: boolean }>`
  flex: 1;
  min-width: 0;
  font-size: 15px;
  line-height: 135%;
  color: ${({ $isSelected }) => ($isSelected ? "#fff" : "#000")};
`;

export const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

export const UsageText = styled.span`
  ${theme.fonts.pretendard}
  color: #0a4f83;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 135%;
  letter-spacing: 0;
`;

export const Commend = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 3.625rem;
  padding: 0.625rem 1rem;
  width: 100%;
  border-radius: 0.125rem;
  background: ${({ $isSelected }) =>
    $isSelected ? theme.colors.primary : "#fff"};
  gap: 0.375rem;
  cursor: pointer;

  border: ${({ $isSelected }) =>
    $isSelected ? "1px solid #143858" : "1px solid transparent"};

  &:active {
    background-color: ${({ $isSelected }) =>
      $isSelected ? theme.colors.primary : "#d9dade"};
  }
`;

export const FirstLine = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  justify-content: center;
  align-items: center;

  svg {
    flex: 0 0 auto;
    transform: translateY(-0.125rem);
  }

  path {
    fill: ${({ $isSelected }) => ($isSelected ? "#fff" : "#000")};
  }
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

export const ActionBar = styled.div`
  width: 100%;
  margin-top: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`;

export const ActionButton = styled.button`
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 0.5px solid ${theme.colors.primary};
  border-bottom: 0.5px solid ${theme.colors.primary};
  background-color: transparent;
  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 120%;
  cursor: pointer;

  &:disabled {
    border-color: #dedede;
    color: #c3c5c9;
    cursor: default;
  }

  &:active:not(:disabled) {
    background-color: rgba(20, 56, 88, 0.08);
  }
`;

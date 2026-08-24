import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  background-color: ${theme.colors.secondary};
  overflow: hidden;
`;

export const Content = styled.div`
  width: 100%;
  padding: 3.125rem 1.5rem 0; /* 50px 24px 0 */
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

export const MessageField = styled.label<{ $isFocused: boolean }>`
  width: 100%;
  min-height: 2.875rem; /* 46px */
  padding: 0 3.75rem; /* 0 60px */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem; /* 10px */
  border-radius: 0.75rem 0 0.75rem 0;
  background-color: ${({ $isFocused }) =>
    $isFocused ? theme.colors.white : theme.colors.primary};
  color: ${({ $isFocused }) =>
    $isFocused ? theme.colors["fg-primary"] : theme.colors.secondary};

  ${theme.fonts.batang}
  font-size: 0.875rem; /* 14px */
  font-weight: 700;
  letter-spacing: -0.28px;
`;

export const QuoteMark = styled.span`
  color: currentColor;
  font-size: 1.5rem; /* 24px */
  line-height: 1;
  flex: 0 0 auto;
`;

export const MessageInput = styled.input<{ $isFocused: boolean }>`
  width: 100%;
  min-width: 0;
  background-color: transparent;
  border: 0;
  outline: none;
  text-align: center;

  ${theme.fonts.batang}
  color: ${({ $isFocused }) =>
    $isFocused ? theme.colors["fg-primary"] : theme.colors.secondary};
  font-size: 0.875rem; /* 14px */
  font-weight: 700;
  letter-spacing: -0.28px;

  &::placeholder {
    color: ${({ $isFocused }) =>
      $isFocused ? "#9ca0a6" : "rgba(239, 240, 242, 0.72)"};
  }
`;

export const Desc = styled.div`
  margin-top: 0.875rem; /* 14px */
  ${theme.fonts.pretendard}
  color: #9ca0a6;
  font-weight: 400;
  font-size: 0.8125rem; /* 13px */
  letter-spacing: -0.26px;
`;

export const BottomActionBar = styled.div`
  width: calc(100% - 3rem);
  margin: 0 1.5rem 3.125rem; /* 0 24px 50px */
`;

export const ActionButton = styled.button`
  width: 100%;
  min-height: 2.875rem; /* 46px */
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 0.5px solid ${theme.colors.primary};
  border-bottom: 0.5px solid ${theme.colors.primary};

  ${theme.fonts.pretendard}
  color: ${theme.colors["fg-primary"]};
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.32px;

  &:active {
    background-color: rgba(20, 56, 88, 0.08);
  }
`;

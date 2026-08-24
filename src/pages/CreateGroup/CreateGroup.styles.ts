import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  position: relative;
  background-color: ${theme.colors.secondary};
  overflow: hidden;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.secondary};
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const NavyBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.secondary};
  padding: 2.75rem 1.5rem 3.25rem; /* 44px 24px 52px */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.625rem; /* 26px */
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem; /* 32px */
`;

export const StepTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem; /* 6px */
`;

export const InputBox = styled(InputContainer)`
  gap: 0.5625rem; /* 9px */

  div {
    ${theme.fonts.pretendard}
    color: ${theme.colors.territory};
    font-size: 0.8125rem; /* 13px */
    font-weight: 400;
    letter-spacing: -0.26px;
  }

  margin-top: 0.25rem;
`;

export const ErrorMsg = styled.div`
  color: ${theme.colors.red} !important;
`;

export const Main = styled.div`
  width: 100%;
  background-color: ${theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 1.875rem; /* 30px */
  padding: 2.75rem 1.5rem 3.25rem; /* 44px 24px 52px */
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.375rem; /* 6px */
`;

export const TitleLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4375rem; /* 7px */
`;

export const Title = styled.div`
  ${theme.fonts.batang}
  font-size: 1rem; /* 16px */
  text-align: center;
  color: #000;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const InviteCount = styled.div`
  ${theme.fonts.pretendard}
  font-size: 0.875rem; /* 14px */
  color: ${theme.colors.territory};
  font-weight: 500;
  letter-spacing: -0.28px;
`;

export const Desc = styled(InviteCount)`
  font-size: 0.8125rem; /* 13px */
  font-weight: 400;
  letter-spacing: -0.26px;
`;

export const FriendListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FriendList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PendingList = styled(FriendList)`
  margin-top: 2.25rem; /* 36px */
  gap: 0.9375rem; /* 15px */
`;

export const PendingTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  ${theme.fonts.batang}
  color: #000;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const EmptyFriendContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem; /* 20px */
`;

export const EmptyFriendList = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3125rem; /* 5px */

  button,
  div {
    ${theme.fonts.pretendard}
    font-size: 0.8125rem; /* 13px */
    letter-spacing: -0.26px;
  }

  button {
    color: #000;
    text-decoration-line: underline;
    font-weight: 500;
    text-underline-position: from-font;
    background-color: transparent;

    &:active {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  div {
    color: ${theme.colors.territory};
    font-weight: 400;
  }
`;

export const BtnBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem; /* 10px */

  &:disabled {
    border-top: 0.5px solid var(--stroke-subtle, #c3c5c9);
    border-bottom: 0.5px solid var(--stroke-subtle, #c3c5c9);
    color: var(--fg-disabled, #c3c5c9);
  }
`;

export const BottomActionBar = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem; /* 10px */

  &:has(> button:only-child) {
    grid-template-columns: 1fr;
  }
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

  &:disabled {
    border-top-color: #dedede;
    border-bottom-color: #dedede;
    color: #c3c5c9;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background-color: rgba(20, 56, 88, 0.08);
  }
`;

export const MTitle = styled.div`
  color: ${theme.colors["fg-primary"]};
  margin-top: 0;
  ${theme.fonts.batang}
  font-size: var(--font-size-t5, 20px);
  font-style: normal;
  font-weight: var(--font-weight-bold, 700);
  line-height: var(--line-height-t5, 30px); /* 150% */
`;

export const STitle = styled.div`
  color: ${theme.colors["fg-subtle"]};

  ${theme.fonts.pretendard}
  font-size: var(--font-size-t2, 14px);
  font-style: normal;
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--line-height-t2, 21px); /* 150% */
  letter-spacing: -0.28px;
`;

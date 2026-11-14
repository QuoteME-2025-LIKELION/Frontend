import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  height: 100dvh;
  background-color: ${theme.colors.secondary};
  overflow: hidden;
`;

export const Content = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  padding: 1.5rem 1.5rem 2rem; /* 24px 24px 32px */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.25rem; /* 36px */
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;

  ${theme.fonts.batang}
  color: ${theme.colors.black};
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PendingSection = styled(FriendList)`
  gap: 0.9375rem; /* 15px */
`;

export const EmptyBox = styled.div`
  width: 100%;
  padding: 4rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: -0.28px;
`;

export const Footer = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding: 1rem 1.5rem max(1.5rem, env(safe-area-inset-bottom));
`;

export const LinkInviteButton = styled.button`
  width: 100%;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  background-color: ${theme.colors.primary};
  ${theme.fonts.pretendard}
  color: ${theme.colors.white};
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.28px;

  cursor: pointer;
`;

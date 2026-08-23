import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  overflow: hidden;
  background-color: ${theme.colors.secondary};
`;

export const Content = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const GrayBox = styled.div`
  width: 100%;
  padding: 2.125rem 1.5rem 1.75rem; /* 34px 24px 28px */
  background-color: ${theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* GroupCard 컴포넌트 오버라이딩 */
export const GroupCard = styled.div`
  position: relative;
  width: 100%;
  min-height: 9.25rem; /* 148px */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: transparent;
`;

export const TextBox = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.625rem; /* 26px */
`;

export const GroupTitle = styled.div`
  ${theme.fonts.batang}
  color: #fff;
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  letter-spacing: -0.4px;
`;

export const Title = styled.div`
  ${theme.fonts.batang}
  color: #000;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 12px */
`;

export const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */

  ${theme.fonts.dotum}
  color: #fff;
  font-size: 0.875rem; /* 14px */
  letter-spacing: -0.28px;

  strong {
    font-weight: 700;
  }

  span {
    font-weight: 400;
  }
`;

export const Since = styled.div`
  position: relative;
  z-index: 1;
  ${theme.fonts.batang}
  color: #fff;
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  letter-spacing: -0.4px;
`;

export const Count = styled.div`
  position: absolute;
  right: 0;
  bottom: 0.3125rem;
  ${theme.fonts.chonburi}
  color: rgba(255, 255, 255, 0.22);
  font-size: 6rem; /* 96px */
  font-weight: 400;
  letter-spacing: 0;
`;

export const Main = styled(Content)`
  flex: 0 0 auto;
  width: 100%;
  min-height: calc(100vh - 14.75rem);
  padding: 2.125rem 1.5rem 2rem; /* 34px 24px 32px */
  gap: 2.625rem; /* 42px */
  background-color: ${theme.colors.secondary};
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9375rem; /* 15px */
`;

export const MessageBox = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 3rem; /* 48px */
  padding: 0.625rem 1.5rem; /* 10px 24px */
  background-color: ${theme.colors.primary};
  border-radius: 0.75rem 0 0.75rem 0; /* 12px 0 12px 0 */
  gap: 0.3125rem; /* 5px */

  div {
    ${theme.fonts.batang}
    font-weight: 500;
  }
`;

export const Quotation = styled.div`
  font-size: 2.5rem; /* 40px */
  letter-spacing: -0.8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0.9rem);
  color: #fff;
  height: 1rem; /* 16px */
`;

export const Text = styled.div`
  font-size: 1rem; /* 16px */
  letter-spacing: -0.28px;
  color: #fff;
`;

export const EmptyText = styled(Text)`
  color: rgba(255, 255, 255, 0.5);
`;

export const EmptyMemberBox = styled.div`
  min-height: 12.5rem; /* 200px */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem; /* 16px */
  text-align: center;

  strong {
    ${theme.fonts.batang}
    color: ${theme.colors.territory};
    font-size: 1.25rem; /* 20px */
    font-weight: 700;
    letter-spacing: -0.4px;
  }

  span {
    ${theme.fonts.pretendard}
    color: ${theme.colors.territory};
    font-size: 0.875rem; /* 14px */
    font-weight: 500;
    letter-spacing: -0.28px;
  }
`;

export const BtnBox = styled(Section)`
  margin-top: auto;
  gap: 0.625rem; /* 10px */
`;

export const RequestList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const RequestItem = styled.div`
  width: 100%;
  border-bottom: 1px solid #dedede;
  display: grid;
  grid-template-columns: 2.8125rem 1fr auto;
  gap: 0.6875rem; /* 11px */
  align-items: center;
  padding: 0.625rem 0; /* 10px 0 */
`;

export const RequestProfileImg = styled.img`
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const RequestDefaultProfileImg = styled.div`
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  background-color: ${theme.colors.territory};
`;

export const RequestUserBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem; /* 8px */
  min-width: 0;

  div {
    ${theme.fonts.dotum}
    font-size: 0.875rem; /* 14px */
    letter-spacing: -0.28px;
  }
`;

export const RequestUsername = styled.div`
  font-weight: 700;
  color: #000;
`;

export const RequestIntro = styled.div`
  font-weight: 500;
  color: ${theme.colors.territory};
`;

export const RequestActionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */

  button {
    ${theme.fonts.dotum}
    color: ${theme.colors.territory};
    font-size: 0.8125rem; /* 13px */
    font-weight: 500;
    letter-spacing: -0.26px;
    text-decoration-line: underline;
    text-underline-position: from-font;

    &:last-of-type {
      color: ${theme.colors.red};
    }

    &:disabled {
      color: ${theme.colors.territory};
      cursor: default;
    }
  }
`;

export const QuitBtn = styled.button`
  width: 100%;
  padding: 0.4375rem 0.625rem; /* 7px 10px */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;

  ${theme.fonts.batang}
  color: ${theme.colors.territory};
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.32px;
  text-decoration-line: underline;
  text-align: center;
  text-underline-position: from-font;
`;

import theme from "@/styles/theme";
import styled from "@emotion/styled";
import * as G from "@/pages/FriendGroup/components/GroupCardStyle";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GrayBox = styled.div`
  width: 100%;
  padding: 1.875rem 2.5rem 0; /* 30px 40px 0 */
  background-color: ${theme.colors.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* GroupCard 컴포넌트 오버라이딩 */
export const GroupCard = styled(G.GroupBox)`
  background-color: #fff;
  padding: 1.25rem 0.625rem; /* 20px 10px */
  border-top: 0.5px solid #000;
  border-bottom: 0.5px solid #000;
`;

export const TextBox = styled(G.TextBox)``;

export const Title = styled(G.Title)``;

export const InfoBox = styled(G.InfoBox)``;

export const InfoLine = styled(G.InfoLine)``;

export const Chonburi = styled.div`
  ${theme.fonts.chonburi}
`;

export const Count = styled(G.Count)``;

export const Main = styled(Content)`
  padding: 1rem 2.5rem 1.875rem; /* 30px 40px */
  gap: 3.125rem; /* 50px */
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9375rem; /* 15px */
`;

export const MessageBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 1.5rem; /* 10px 24px */
  background-color: ${theme.colors.primary};
  border-radius: 0.625rem 0; /* 10px 0 */
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

export const BtnBox = styled(Section)`
  gap: 0.625rem; /* 10px */
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

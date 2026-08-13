import styled from "@emotion/styled";
import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  background-color: #fff;
`;

export const Content = styled.div`
  width: 100%;
  padding: 0.9375rem 2.5rem; /* 15px 40px */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.25rem; /* 36px */
`;

export const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;

  ${theme.fonts.batang}
  color: #000;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.9375rem; /* 15px */
`;

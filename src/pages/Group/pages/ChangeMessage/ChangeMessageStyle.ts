import styled from "@emotion/styled";
import * as G from "@/pages/Group/GroupStyle";
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
  padding: 1.25rem 2.5rem; /* 20px 40px */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled(G.Title)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem; /* 10px */
  margin: 1.25rem 0 2.5rem; /* 20px 0 40px */
`;

export const Desc = styled.div`
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-weight: 400;
  font-size: 0.8125rem; /* 13px */
  letter-spacing: -0.26px;
`;

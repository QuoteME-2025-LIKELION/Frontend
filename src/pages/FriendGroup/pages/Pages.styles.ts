import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  background-color: ${theme.colors.secondary};
  height: 100vh;
  gap: 1.875rem;
`;

export const Content = styled.div`
  width: 100%;
  padding: 0 2.1875rem 1.875rem; /* 0 35px 30px */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem; /* 30px */
  height: 100%;
  max-height: calc(100vh - 74px);
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const EmptyBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 0.9375rem;
  font-weight: 400;
  letter-spacing: -0.3px;
  text-align: center;
  padding: 0;
  height: 100%;
`;

import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const FeedList = styled.div`
  padding: 20px 35px;
  gap: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const NoFeedText = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  ${theme.fonts.batang}
  color: ${theme.colors.territory};
  letter-spacing: -0.28px;
`;

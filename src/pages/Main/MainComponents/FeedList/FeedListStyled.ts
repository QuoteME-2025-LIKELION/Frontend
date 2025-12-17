import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const FeedList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0;

  /* 명언 이미지 저장을 감안해 각 Feed에 padding 추가 */
  & > div {
    width: 100%;
    padding: 10px 35px;
  }
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

import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const FeedList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 0;
  max-width: 393px;
  background-color: ${theme.colors.secondary};
  height: 100%;
  gap: 1.5rem;

  /* 명언 이미지 저장을 감안해 각 Feed에 padding 추가 */
  & > div:not([data-toast-overlay]) {
    width: 100%;
    padding: 0;
  }
`;

export const NoFeedText = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  ${theme.fonts.batang}
  color: ${theme.colors.territory};
  letter-spacing: -0.28px;
`;

export const NoFeedbox = styled.div`
  margin-top: 50%;
`;

export const NoFeedSubText = styled.div`
  width: 100%;
  color: var(--fg-subtle, #9599a1);
  text-align: center;

  /* caption/description/md */
  font-family: Pretendard;
  font-size: var(--font-size-t2, 14px);
  font-style: normal;
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--line-height-t2, 21px); /* 150% */
  letter-spacing: -0.28px;
`;

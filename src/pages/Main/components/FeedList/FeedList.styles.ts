import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const FeedList = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 2.5rem;
  max-width: 393px;
  background-color: ${theme.colors.secondary};
  height: 100%;
  overflow-y: auto;
  gap: 1.25rem;

  /* 명언 이미지 저장을 감안해 각 Feed에 padding 추가 */
  & > div:not([data-toast-overlay]) {
    width: 100%;
    padding: 0;
  }
`;

export const FilterBox = styled.div`
  position: relative;
  width: 100%;
  z-index: 2;
`;

export const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 140%;
  cursor: pointer;

  img {
    width: 1rem;
    height: 1rem;
  }
`;

export const FilterMenu = styled.div`
  position: absolute;
  top: 1.75rem;
  left: 0;
  width: 8.25rem;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  overflow: hidden;
`;

export const FilterOption = styled.button<{ $active: boolean }>`
  width: 100%;
  min-height: 2.75rem;
  padding: 0 0.5rem;
  border-bottom: 1px solid #dedede;
  ${theme.fonts.pretendard}
  color: ${({ $active }) => ($active ? "#000" : theme.colors.territory)};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-align: center;
  cursor: pointer;

  &:last-of-type {
    border-bottom: 0;
  }
`;

export const NoFeedText = styled.div`
  width: 100%;
  padding: 0 0 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  ${theme.fonts.batang}
  color: ${theme.colors.territory};
  letter-spacing: -0.28px;
`;

export const NoFeedbox = styled.div`
  margin-top: 11rem;
`;

export const NoFeedSubText = styled.div`
  width: 100%;
  color: var(--fg-subtle, #9599a1);
  text-align: center;

  /* caption/description/md */
  ${theme.fonts.pretendard}
  font-size: var(--font-size-t2, 14px);
  font-style: normal;
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--line-height-t2, 21px); /* 150% */
  letter-spacing: -0.28px;
`;

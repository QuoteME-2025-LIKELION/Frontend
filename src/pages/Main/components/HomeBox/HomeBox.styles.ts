import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  background-color: ${() => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  padding: 1.5rem 1.5rem 1.25rem;
`;

export const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
`;
export const Month = styled.div`
  color: #fff;
  text-align: center;
  ${theme.fonts.bombaram};
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 36px */
  letter-spacing: -0.72px;
`;

export const Weekday = styled.div`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  ${theme.fonts.batang}
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 12px */
  letter-spacing: -0.24px;
`;

export const Wrapper = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 1.125rem;
  color: white;
  cursor: pointer;
`;

export const Text = styled.div<{ hasFeed: boolean }>`
  width: 100%;
  color: ${({ hasFeed }) => (hasFeed ? "#fff" : "rgba(255, 255, 255, 0.7)")};
  text-align: center;
  ${theme.fonts.batang}
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  border-top: 1px solid #fff;
`;

export const Day = styled.div`
  color: #fff;
  text-align: center;
  ${theme.fonts.bombaram}
  font-size: 75px;
  font-style: normal;
  font-weight: 400;
  line-height: 95%;
  letter-spacing: -1.5px;
  flex: 0 0 4.125rem;
  transform: translateY(-0.45rem);
`;

export const QuoteArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Bottom = styled.div`
  position: relative;
  width: 100%;
  min-height: 2.25rem;
  margin-top: 0;
  padding-top: 0.75rem;
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr) auto;
  align-items: center;
  border-top: 1px solid #fff;
`;

export const TagBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const TagButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #fff;
  ${theme.fonts.pretendard}
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  img {
    width: 1rem;
    height: 1rem;
  }
`;

export const TagMenu = styled.div`
  position: absolute;
  top: 1.75rem;
  left: 0;
  width: 8.25rem;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14);
  overflow: hidden;
  z-index: 3;
`;

export const TagName = styled.div`
  min-height: 2.25rem;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #dedede;
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: center;
`;

export const TagEditButton = styled.button`
  width: 100%;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
`;

export const AuthorBox = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  justify-content: center;
`;

export const AuthorDivider = styled.span`
  width: 1.5rem;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.72);
`;

export const AuthorText = styled.div`
  min-width: 0;
  ${theme.fonts.batang}
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.26px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BottomActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

export const IconButton = styled.button<{ $hidden?: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:disabled {
    cursor: default;
    opacity: ${({ $hidden }) => ($hidden ? 0 : 0.45)};
  }
`;

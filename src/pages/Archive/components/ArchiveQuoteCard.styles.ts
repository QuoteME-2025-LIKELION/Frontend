import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.article`
  width: 100%;
  padding: 1.125rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #fff;
`;

export const OpenButton = styled.button`
  width: 100%;
  padding: 0;
  border: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: inherit;
  text-align: inherit;
  cursor: pointer;
`;

export const Author = styled.div`
  ${theme.fonts.batang}
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.28px;
`;

export const QuoteBox = styled.div`
  min-height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
`;

export const QuoteMark = styled.span`
  ${theme.fonts.batang}
  color: #fff;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 0.8;
`;

export const Content = styled.p`
  ${theme.fonts.batang}
  color: #fff;
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 155%;
  letter-spacing: -0.34px;
  text-align: center;
  word-break: keep-all;
`;

export const OriginalContent = styled.p`
  ${theme.fonts.pretendard}
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 155%;
  letter-spacing: -0.26px;
  text-align: center;
  word-break: keep-all;
`;

export const ActionRow = styled.div`
  width: 100%;
  min-height: 2.25rem;
  padding: 0.375rem 0.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.62);
  border-bottom: 1px solid rgba(255, 255, 255, 0.62);
`;

export const TagBox = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const TagText = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow: hidden;
  ${theme.fonts.pretendard}
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: -0.24px;
  white-space: nowrap;
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const IconButton = styled.button`
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 1rem;
    height: 1rem;
  }
`;

import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  min-height: 100vh;
  background: ${theme.colors.secondary};
`;

export const TopSection = styled.section`
  padding: 2.375rem 1.5rem 2.625rem;
  background: ${theme.colors.primary};
  color: #fff;
`;

export const SectionTitle = styled.h2<{ $light?: boolean }>`
  ${theme.fonts.batang};
  color: ${({ $light }) => ($light ? "#fff" : "#000")};
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.28px;
  margin: 0;
`;

export const ImportantList = styled.div`
  margin-top: 1.5rem;
`;

export const ImportantItem = styled.div`
  width: 100%;
  padding: 0.9375rem 0.75rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
`;

export const ImportantTitle = styled.div`
  ${theme.fonts.pretendard};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.28px;
`;

export const ImportantDate = styled.div`
  ${theme.fonts.pretendard};
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.28px;
  white-space: nowrap;
`;

export const NewsSection = styled.section`
  padding: 2rem 1.5rem 4.5rem;
`;

export const NewsList = styled.div`
  margin-top: 1.375rem;
`;

export const NewsItem = styled.article`
  width: 100%;
  padding-bottom: 1.4375rem;
  margin-bottom: 1.4375rem;
  border-bottom: 1px solid #ddd;
`;

export const NewsTitle = styled.h3`
  ${theme.fonts.batang};
  color: #000;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.28px;
  margin: 0;
`;

export const NewsDate = styled.div`
  margin-top: 0.5rem;
  ${theme.fonts.pretendard};
  color: #9599a1;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.28px;
`;

export const NewsContent = styled.p`
  margin-top: 0.625rem;
  ${theme.fonts.pretendard};
  color: #000;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.55;
  letter-spacing: -0.28px;
  word-break: keep-all;
`;

export const MoreButton = styled.button`
  display: block;
  margin: 0.25rem auto 0;
  padding: 0.5rem 1rem;
  ${theme.fonts.pretendard};
  color: #9599a1;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.28px;
`;

export const Empty = styled.div`
  padding: 2rem 0;
  ${theme.fonts.pretendard};
  color: #9599a1;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.28px;
`;

import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.9375rem 2.5rem; /* 15px 40px */
  gap: 0.625rem; /* 10px */
  cursor: pointer;
`;

export const DateBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3125rem; /* 5px */

  div {
    text-align: center;
  }
`;

export const Date = styled.div`
  ${theme.fonts.chonburi}
  color: #fff;
  font-size: 1.25rem; /* 20px */
  font-weight: 400;
  letter-spacing: -0.4px;
`;

export const Day = styled.div`
  ${theme.fonts.batang}
  color: rgba(255, 255, 255, 0.60);
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  letter-spacing: -0.24px;
`;

export const FeedContainer = styled.div`
  width: 100%;
  border: 1px solid #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.625rem; /* 10px */
`;

export const TitleBox = styled.div`
  width: 100%;
  padding: 0.3125rem 0.625rem; /* 5px 10px */
  background-color: ${theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-content: center;
  gap: 1.125rem; /* 18px */
  padding: 0.5rem 0; /* 8px 0 */

  color: #000;
  ${theme.fonts.batang}
  font-weight: 500;
`;

export const Quotation = styled.div`
  font-size: 2.5rem; /* 40px */
  letter-spacing: -0.8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0.9rem);
  height: 0.5625rem; /* 9px */
`;

export const Title = styled.div`
  font-size: 1rem; /* 16px */
  letter-spacing: -0.32px;
  text-align: center;
`;

export const Desc = styled.div`
  width: 100%;
  padding: 0 0.75rem; /* 0 12px */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  justify-content: center;
  align-items: center;
  max-height: 1.75rem; /* 28px */
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  word-break: break-all;

  ${theme.fonts.pretendard}
  color: #fff;
  font-size: 0.75rem;
  line-height: 120%; /* 14.4px */
  letter-spacing: -0.24px;
  font-weight: 500;
`;

export const TagContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #fff;
  padding: 0.3125rem; /* 5px */
  gap: 0.3125rem; /* 5px */
`;

export const TagBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem; /* 5px */
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem; /* 5px */
  flex-wrap: wrap;
  div {
    ${theme.fonts.pretendard}
    color: #fff;
    font-size: 0.75rem; /* 12px */
    font-weight: 500;
    letter-spacing: -0.24px;
  }
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.1875rem; /* 3px */

  svg {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.button`
  display: grid;
  grid-template-columns: 1rem 1fr;
  align-items: center;
  width: 100%;
  max-width: 18.5625rem; /* 297px */
  background-color: #fff;
  gap: 0.75rem; /* 12px */
  padding: 0.3125rem 0; /* 5px 0 */
  border-bottom: 0.5px solid #000;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.75rem; /* 12px */
  overflow: hidden;
`;

export const TextBox = styled.div`
  display: flex;
  align-items: center;
  justify-self: flex-start;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;

  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  letter-spacing: -0.28px;
  overflow: hidden;
`;

export const Nickname = styled.div`
  font-weight: 600;
  flex-shrink: 0;
`;

export const Message = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Timestamp = styled.div`
  flex-shrink: 0;
  ${theme.fonts.dotum}
  color: ${theme.colors.territory};
  font-size: 0.8125rem; /* 13px */
  font-weight: 500;
  letter-spacing: -0.28px;
`;

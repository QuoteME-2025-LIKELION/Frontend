import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.button`
  display: grid;
  grid-template-columns: 2.75rem 1fr;
  align-items: start;
  width: 100%;
  background-color: transparent;
  gap: 0.75rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid #ddd;
  text-align: left;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 0.75rem; /* 12px */
  overflow: hidden;
`;

export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  justify-self: flex-start;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;

  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.875rem; /* 14px */
  font-weight: 600;
  letter-spacing: -0.28px;
  overflow: hidden;
`;

export const Icon = styled.span<{
  $variant: "group" | "friend" | "tag";
  $isRead: boolean;
}>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $isRead, $variant }) => {
    if ($isRead) return "#fff";
    return $variant === "friend" ? "#fff" : theme.colors.primary;
  }};
  border: ${({ $isRead, $variant }) =>
    $isRead || $variant === "friend" ? "1px solid #ddd" : "none"};
  color: ${({ $isRead, $variant }) => {
    if ($isRead) return theme.colors["fg-subtle"];
    return $variant === "friend" ? "#000" : "#fff";
  }};
  ${theme.fonts.batang};
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const Category = styled.span`
  margin-bottom: 0.25rem;
  ${theme.fonts.pretendard};
  color: #4f7fa5;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const Message = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.35;
`;

export const Timestamp = styled.div`
  flex-shrink: 0;
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 0.8125rem; /* 13px */
  font-weight: 500;
  letter-spacing: -0.28px;
`;

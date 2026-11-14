import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const MenuWrap = styled.div`
  position: relative;
  align-self: center;
`;
export const MoreButton = styled.button`
  width: 1.75rem;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors["grey-400"]};
  cursor: pointer;
`;
export const Menu = styled.div`
  position: absolute;
  top: 2.5rem;
  right: 0;
  width: 8.25rem;
  padding: 0.25rem 0.375rem;
  z-index: 3;
  border-radius: 4px;
  background: ${theme.colors.white};
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
`;
export const MenuItem = styled.button`
  width: 100%;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-bottom: 1px solid ${theme.colors["grey-100"]};
  ${theme.fonts.pretendard}
  font-size: 0.875rem;
  color: ${theme.colors.black};
  cursor: pointer;
  &:last-child { border-bottom: 0; }
  svg { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
`;

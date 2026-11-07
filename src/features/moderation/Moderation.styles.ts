import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const MenuWrap = styled.div`
  position: relative;
  align-self: start;
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
export const Overlay = styled.dialog`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 1.5rem;
  border: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  &:not([open]) { display: none; }
  &::backdrop { background: transparent; }
`;
export const ReportPanel = styled.form`
  width: 100%;
  max-width: 21.5625rem;
  max-height: calc(100dvh - 3rem);
  overflow-y: auto;
  padding: 1.5rem;
  background: ${theme.colors.white};
  color: ${theme.colors.black};
`;
export const Title = styled.h2`
  margin: 0 0 0.5rem;
  ${theme.fonts.batang}
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5;
`;
export const ReasonList = styled.fieldset`
  margin: 0;
  padding: 0;
  border: 0;
  legend {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
`;
export const Reason = styled.label`
  min-height: 3.3125rem;
  padding: 0.625rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid ${theme.colors["grey-100"]};
  ${theme.fonts.pretendard}
  font-size: 0.8125rem;
  line-height: 1.5;
  cursor: pointer;
  input { width: 1.125rem; height: 1.125rem; accent-color: ${theme.colors.black}; flex-shrink: 0; }
`;
export const Details = styled.textarea`
  width: 100%;
  height: 5rem;
  resize: none;
  overflow-y: auto;
  padding: 0.75rem;
  border: 0;
  background: transparent;
  ${theme.fonts.pretendard}
  color: ${theme.colors.black};
  font-size: 0.8125rem;
  line-height: 1.5;
  &::placeholder { color: ${theme.colors["grey-400"]}; }
`;
export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  button {
    flex: 1;
    min-height: 2.75rem;
    ${theme.fonts.pretendard}
    color: ${theme.colors.black};
    font-size: 0.875rem;
    cursor: pointer;
  }
  button[type="submit"] { color: ${theme.colors.primary}; }
  button:disabled { opacity: 0.45; cursor: default; }
`;

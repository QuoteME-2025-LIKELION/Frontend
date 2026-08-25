import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  height: 100vh;
  background: ${theme.colors.secondary};
`;

export const List = styled.div`
  width: 100%;
  padding: 3rem 1.5rem 0;
`;

export const Row = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  min-height: 4.625rem;
  padding: 0.875rem 0.75rem 0.875rem 2.25rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 1rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
  color: ${({ $disabled }) => ($disabled ? "#c7cbd1" : "#24262c")};
`;

export const MasterRow = styled(Row)`
  min-height: 2.875rem;
  padding: 0 0.75rem;
`;

export const TextBox = styled.span`
  min-width: 0;
`;

export const Title = styled.span`
  display: block;
  ${theme.fonts.pretendard};
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.015rem;
`;

export const Description = styled.span`
  display: block;
  margin-top: 0.5rem;
  ${theme.fonts.pretendard};
  color: inherit;
  opacity: 0.72;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: -0.0125rem;
  word-break: keep-all;
`;

export const Value = styled.span<{ $active?: boolean; $disabled?: boolean }>`
  ${theme.fonts.pretendard};
  color: ${({ $active, $disabled }) => {
    if ($disabled) return "#c7cbd1";
    return $active ? theme.colors.primary : "#9599a1";
  }};
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.0125rem;
  white-space: nowrap;
`;

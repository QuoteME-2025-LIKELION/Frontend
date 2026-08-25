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

export const PickerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9997;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.36);
`;

export const PickerSheet = styled.div`
  width: 100%;
  max-width: 393px;
  padding: 2.125rem 1.5rem 2.75rem;
  border-radius: 0.75rem 0.75rem 0 0;
  background: ${theme.colors.secondary};
`;

export const PickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 0.75rem;
`;

export const PickerColumn = styled.div`
  height: 7.875rem;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  padding: 2.375rem 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PickerOption = styled.button<{ $selected?: boolean }>`
  width: 100%;
  min-height: 1.75rem;
  scroll-snap-align: center;
  ${theme.fonts.batang};
  color: ${({ $selected }) => ($selected ? "#24262c" : "#a4a9b0")};
  font-size: 1.25rem;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  letter-spacing: -0.025rem;
`;

export const PickerDoneButton = styled.button`
  width: 100%;
  margin-top: 2rem;
  padding: 0.875rem 0;
  border-top: 1px solid #8392a0;
  border-bottom: 1px solid #8392a0;
  ${theme.fonts.pretendard};
  color: #24262c;
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.28px;
`;

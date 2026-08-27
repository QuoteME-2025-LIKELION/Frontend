import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 393px;
  min-height: 100vh;
  background-color: ${theme.colors.secondary};
`;

export const Content = styled.main`
  width: 100%;
  padding: 3.25rem 1.5rem 0;
`;

export const Section = styled.section`
  width: 100%;

  & + & {
    margin-top: 2.375rem;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  ${theme.fonts.batang}
  color: #21242b;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.36px;
`;

export const InfoList = styled.div`
  width: 100%;
`;

export const InfoRow = styled.button`
  width: 100%;
  min-height: 3.375rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #d8dadd;
  text-align: left;
`;

export const RowLabel = styled.span`
  ${theme.fonts.pretendard}
  color: #21242b;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;
`;

export const RowValue = styled.span`
  ${theme.fonts.pretendard}
  color: #9599a1;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.26px;
  white-space: nowrap;
`;

export const WarningMessage = styled.div`
  margin-top: 0.75rem;
  ${theme.fonts.pretendard}
  color: ${theme.colors.red};
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.26px;
`;

export const LinkedList = styled.div`
  width: 100%;
`;

export const LinkedRow = styled.div`
  width: 100%;
  min-height: 4.25rem;
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.8125rem;
  border-bottom: 1px solid #d8dadd;
`;

export const LinkedActionRow = styled.button`
  width: 100%;
  min-height: 4.25rem;
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.8125rem;
  border-bottom: 1px solid #d8dadd;
  text-align: left;
  cursor: pointer;
`;

export const ProviderIcon = styled.img`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const ProviderIconFrame = styled.span`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  overflow: hidden;
`;

export const ProviderName = styled.span`
  ${theme.fonts.pretendard}
  color: #21242b;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.28px;
`;

export const ProviderStatus = styled.span`
  ${theme.fonts.pretendard}
  color: #9599a1;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.26px;
  white-space: nowrap;
`;

export const BottomActions = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
`;

export const LogoutButton = styled.button`
  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;
`;

export const DeleteButton = styled.button`
  ${theme.fonts.pretendard}
  color: ${theme.colors.red};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;
`;

export const SheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9997;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.36);
`;

export const Sheet = styled.div`
  width: 100%;
  max-width: 393px;
  padding: 2rem 1.5rem 3rem;
  border-radius: 0.75rem 0.75rem 0 0;
  background-color: ${theme.colors.secondary};
`;

export const GenderList = styled.div`
  width: 100%;
`;

export const GenderOption = styled.button`
  width: 100%;
  min-height: 3.3125rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1.5rem;
  align-items: center;
  border-bottom: 1px solid #d8dadd;
  text-align: left;

  &:last-of-type {
    border-bottom: 0;
  }

  span {
    ${theme.fonts.pretendard}
    color: #21242b;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: -0.28px;
  }
`;

export const CheckMark = styled.span`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;

  &::before {
    content: "";
    position: absolute;
    left: 0.4375rem;
    top: 0.25rem;
    width: 0.5rem;
    height: 0.875rem;
    border-right: 1.5px solid #21242b;
    border-bottom: 1.5px solid #21242b;
    transform: rotate(45deg);
  }
`;

export const YearPicker = styled.div`
  height: 8.75rem;
  overflow-y: auto;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.125rem;
  padding: 2.5rem 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PickerOption = styled.button<{ $selected?: boolean }>`
  width: 100%;
  min-height: 1.75rem;
  ${theme.fonts.batang}
  color: ${({ $selected }) => ($selected ? "#21242b" : "#9599a1")};
  font-size: 1.25rem;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  line-height: 1.35;
  letter-spacing: -0.4px;
`;

export const SheetDoneButton = styled.button`
  width: 100%;
  min-height: 2.75rem;
  margin-top: 1.625rem;
  border-top: 1px solid #8392a0;
  border-bottom: 1px solid #8392a0;
  ${theme.fonts.pretendard}
  color: #21242b;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;
`;

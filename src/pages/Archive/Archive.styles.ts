import { css } from "@emotion/react";
import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  background-color: ${theme.colors.secondary};
  height: 100vh;
`;

export const TopBar = styled.header`
  width: 100%;
  min-height: 3.75rem;
  padding: 0.875rem 1.5rem;
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) 2rem;
  align-items: center;
  background-color: ${theme.colors.secondary};
`;

export const HeaderButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const HeaderTitle = styled.h1`
  ${theme.fonts.batang}
  color: #000;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.36px;
  text-align: center;
`;

export const MonthBar = styled.div`
  width: 100%;
  padding: 0.75rem 1.5rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  background-color: ${theme.colors.secondary};
`;

export const MonthButton = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const MonthText = styled.button`
  ${theme.fonts.batang}
  color: #000;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.4px;
  cursor: pointer;
`;

export const CalendarButton = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const CalendarGrid = styled.div`
  width: 100%;
  padding: 0 1.5rem 1.25rem;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 0.75rem;
  background-color: ${theme.colors.secondary};
`;

export const Weekday = styled.div<{ $sunday?: boolean }>`
  ${theme.fonts.pretendard}
  color: ${({ $sunday }) => ($sunday ? "#2b6da6" : "#000")};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 2rem;
  text-align: center;
`;

export const DayButton = styled.button<{
  $selected?: boolean;
  $today?: boolean;
  $outside?: boolean;
}>`
  width: 2.75rem;
  height: 2.75rem;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${theme.fonts.pretendard}
  color: ${({ $outside }) => ($outside ? "#c9cbd0" : "#000")};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;

  ${({ $today }) =>
    $today &&
    css`
      background-color: #fff;
      border: 1px solid #2b6da6;
      color: #2b6da6;
    `}

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: ${theme.colors.primary};
      color: #fff;
      border: 0;
    `}
`;

export const ContentArea = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.primary};
`;

export const Menu = styled.nav`
  width: 100%;
  background-color: ${theme.colors.primary};
  padding: 0.875rem 1.5rem 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  gap: 0.5rem;
`;

export const Btn = styled.button<{ $active: boolean }>`
  min-width: 0;
  min-height: 2.875rem;
  padding: 0.3125rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: transparent;
  outline: none;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);

  ${theme.fonts.batang}
  color: rgba(255, 255, 255, 0.55);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.32px;

  ${({ $active }) =>
    $active &&
    css`
      color: #fff;
      border-top-color: rgba(255, 255, 255, 0.62);
      border-bottom-color: rgba(255, 255, 255, 0.62);
    `}
`;

export const MonthPickerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.38);
`;

export const MonthPicker = styled.div`
  width: min(18.625rem, calc(100% - 4rem));
  padding: 1.5rem 1.75rem 1rem;
  border-radius: 4px;
  background-color: ${theme.colors.secondary};
`;

export const PickerHeader = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.125rem;
`;

export const PickerYear = styled.span`
  ${theme.fonts.batang}
  color: #000;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.4px;
`;

export const MonthList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem 0.5rem;
`;

export const MonthOption = styled.button<{ $active: boolean }>`
  min-height: 2.75rem;
  border-radius: 4px;
  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${theme.colors.primary};
      color: #fff;
    `}
`;

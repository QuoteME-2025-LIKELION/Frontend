import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.375rem; /* 22px */
`;

export const GroupBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Btn = styled(GroupBox)`
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

  &:active {
    background-color: ${theme.colors.secondary};
  }
`;

export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* 20px */
`;

export const Title = styled.div`
  ${theme.fonts.batang}
  color: #000;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem; /* 10px */
`;

export const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem; /* 5px */

  ${theme.fonts.dotum}
  color: #000;
  font-size: 0.875rem; /* 14px */
  letter-spacing: -0.28px;

  div:first-of-type {
    font-weight: 500;
  }

  div:last-of-type {
    font-weight: 300;
  }
`;

export const Count = styled.div`
  ${theme.fonts.chonburi}
  color: #ddd;
  font-size: 6rem; /* 96px */
  font-weight: 400;
  letter-spacing: -1.92px;
`;

import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div<{
  $isSelectable: boolean;
  $isSelected: boolean;
}>`
  width: 100%;
  border-bottom: 1px solid ${theme.colors.secondary};
  display: grid;
  grid-template-columns: 2.8125rem 1fr 1.4375rem;
  gap: 0.6875rem; /* 11px */
  align-items: center;
  padding: 0.625rem; /* 10px */
  background-color: ${({ $isSelected }) =>
    $isSelected ? theme.colors.secondary : "#fff"};
  cursor: ${({ $isSelectable }) => ($isSelectable ? "pointer" : "default")};
`;

export const ProfileImg = styled.img`
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem; /* 8px */
  width: 100%;

  div {
    ${theme.fonts.dotum}
    font-size: 0.875rem; /* 14px */
    letter-spacing: -0.28px;
  }
`;

export const Username = styled.div`
  font-weight: 700;
  color: #000;
`;

export const Intro = styled.div`
  font-weight: 500;
  color: ${theme.colors.territory};
`;

export const BtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.4375rem;

  button {
    width: 100%;
    ${theme.fonts.dotum}
    font-size: 0.8125rem; /* 13px */
    font-weight: 500;
    letter-spacing: -0.26px;
    text-decoration-line: underline;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
    text-underline-position: from-font;
  }
`;

export const DeleteBtn = styled.button<{ $isSelected: boolean }>`
  color: ${({ $isSelected }) =>
    $isSelected ? "#000" : theme.colors.territory};
`;

export const AddBtn = styled.button`
  color: #000;
`;

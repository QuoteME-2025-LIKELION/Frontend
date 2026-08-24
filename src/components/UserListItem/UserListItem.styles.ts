import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div<{
  $isSelectable: boolean;
  $isSelected: boolean;
}>`
  width: 100%;
  border-bottom: 1px solid #dedede;
  display: grid;
  grid-template-columns: 2.8125rem minmax(0, 1fr) auto;
  gap: 0.6875rem; /* 11px */
  align-items: center;
  padding: 0.625rem 0; /* 10px 0 */
  background-color: ${({ $isSelected }) =>
    $isSelected ? "#e8e8e8" : "transparent"};
  cursor: ${({ $isSelectable }) => ($isSelectable ? "pointer" : "default")};

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
`;

export const ProfileImg = styled.img`
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const DefaultProfileImg = styled.div`
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  background-color: ${theme.colors.territory};
`;

export const UserBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem; /* 8px */
  width: 100%;
  min-width: 0;

  div {
    ${theme.fonts.dotum}
    font-size: 0.875rem; /* 14px */
    letter-spacing: -0.28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  justify-content: flex-end;
  width: auto;

  button {
    min-width: 1.4375rem;
    ${theme.fonts.dotum}
    font-size: 0.8125rem; /* 13px */
    font-weight: 500;
    letter-spacing: -0.26px;
    text-decoration-line: underline;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
    text-underline-position: from-font;

    &:active {
      background-color: ${theme.colors.secondary};
    }
  }
`;

export const DeleteBtn = styled.button`
  color: ${theme.colors.territory};
`;

export const AddBtn = styled.button`
  color: ${theme.colors.territory};
`;

import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const RequestItemBase = styled.div`
  width: 100%;
  border-bottom: 1px solid #dedede;
  display: grid;
  grid-template-columns: 2.8125rem 1fr auto;
  gap: 0.6875rem; /* 11px */
  align-items: center;
  padding: 0.625rem 0; /* 10px 0 */
  background-color: transparent;
`;

export const RequestProfileImgBase = styled.img`
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const RequestDefaultProfileImgBase = styled.div`
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  background-color: ${theme.colors.territory};
`;

export const RequestUserBoxBase = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem; /* 8px */
  min-width: 0;

  div {
    ${theme.fonts.dotum}
    font-size: 0.875rem; /* 14px */
    letter-spacing: -0.28px;
  }
`;

export const RequestUsernameBase = styled.div`
  font-weight: 700;
  color: #000;
`;

export const RequestIntroBase = styled.div`
  font-weight: 500;
  color: ${theme.colors.territory};
`;

export const RequestActionBoxBase = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */

  button {
    ${theme.fonts.dotum}
    color: ${theme.colors.territory};
    font-size: 0.8125rem; /* 13px */
    font-weight: 500;
    letter-spacing: -0.26px;
    text-decoration-line: underline;
    text-underline-position: from-font;

    &:last-of-type {
      color: ${theme.colors.red};
    }

    &:active:not(:disabled) {
      opacity: 0.55;
    }

    &:disabled {
      color: ${theme.colors.territory};
      cursor: default;
    }

    &:last-of-type:disabled {
      color: ${theme.colors.red};
    }
  }
`;

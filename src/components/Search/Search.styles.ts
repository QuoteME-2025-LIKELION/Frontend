import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.375rem; /* 6px */
`;

export const Container = styled.div`
  width: 100%;
  height: 2.75rem; /* 44px */
  padding: 0.625rem 0.9375rem; /* 10px 15px */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5625rem; /* 9px */
  background-color: ${theme.colors.white};
  border-radius: var(--spacing-radius-xs, 2px);

  &:focus-within {
    outline: 1px solid ${theme.colors.primary};
    outline-offset: -1px;
    background: var(--bg-white, ${theme.colors["grey-00"]});
  }

  @media (forced-colors: active) {
    &:focus-within {
      outline-color: Highlight;
    }
  }

  button {
    flex: 0 0 auto;
    width: 1rem; /* 16px */
    height: 1rem; /* 16px */
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  outline: none;

  /* 입력 초점은 검색창 외곽에서 표시하고, 지우기 버튼의 초점은 유지 */
  &&:focus-visible {
    outline: none;
    box-shadow: none;
  }

  ${theme.fonts.pretendard}
  color: ${theme.colors.black};
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: -0.28px;
  &::placeholder {
    color: ${theme.colors.territory};
  }
`;

export const Desc = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  ${theme.fonts.pretendard}
  font-size: 0.8125rem; /* 13px */
  color: ${theme.colors.territory};
  letter-spacing: -0.26px;
  font-weight: 400;

  @media screen and (max-width: 340px) {
    font-size: 0.6875rem; /* 11px */
  }
`;

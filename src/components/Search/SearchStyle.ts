import theme from "@/styles/theme";
import styled from "@emotion/styled";

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
  padding: 0.4375rem; /* 7px */
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5625rem; /* 9px */
  background-color: ${theme.colors.secondary};

  button {
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
  display: flex;
  align-items: center;
  outline: none;

  ${theme.fonts.pretendard}
  color: #000;
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

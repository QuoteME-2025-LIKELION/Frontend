import theme from "@/styles/theme";
import styled from "@emotion/styled";

/* 가로 길이는 padding으로 맞추기. 일단 100%로 뒀음. */
export const Input = styled.input`
  width: 100%;
  height: 2.1875rem; /* 35px */
  padding: 0.625rem 0.9375rem; /* 10px 15px */
  background-color: ${theme.colors.secondary};
  border-top: 0.5px solid ${theme.colors.territory};
  border-bottom: 0.5px solid ${theme.colors.territory};
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

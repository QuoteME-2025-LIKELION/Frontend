import styled from "@emotion/styled";
import theme from "@/styles/theme";

export const Wrapper = styled.div<{
  $backgroundColor: "primary" | "secondary" | "white";
}>`
  width: 100%;
  max-width: 393px;
  height: 2.75rem; /* 44px */
  padding: 1.25rem 1.5625rem 0; /* 20px 25px 0 */

  background-color: ${({ $backgroundColor }) => {
    if ($backgroundColor === "primary") return theme.colors.primary;
    if ($backgroundColor === "secondary") return theme.colors.secondary;
    if ($backgroundColor === "white") return "#fff";
  }};

  color: ${({ $backgroundColor }) =>
    $backgroundColor === "primary" ? "#fff" : "#000"};
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  letter-spacing: -0.4px;
  ${theme.fonts.batang}
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  button {
    width: 1.5rem; /* 24px */
    height: 1.5rem; /* 24px */
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Div = styled.div`
  width: 1.5rem; /* 24px */
  height: 1.5rem; /* 24px */
`;

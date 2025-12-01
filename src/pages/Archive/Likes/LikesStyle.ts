import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  background-color: ${theme.colors.primary};
  padding: 1.875rem 2.5rem;
  height: 100%;
  max-height: calc(100vh - 98px);
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

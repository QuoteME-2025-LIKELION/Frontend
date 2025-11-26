import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100%;
  max-height: calc(100vh - 98px);
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

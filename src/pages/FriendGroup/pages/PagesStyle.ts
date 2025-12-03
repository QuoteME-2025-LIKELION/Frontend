import * as G from "@/pages/FriendGroup/FriendGroupStyle";
import styled from "@emotion/styled";

export const Container = styled(G.Container)`
  gap: 1.875rem;
`;

export const Content = styled.div`
  width: 100%;
  padding: 0 2.1875rem 1.875rem; /* 0 35px 30px */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem; /* 30px */
  height: 100%;
  max-height: calc(100vh - 74px);
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

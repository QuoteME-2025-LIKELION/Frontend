import styled from "@emotion/styled";
import * as C from "@/pages/Group/pages/ChangeMessage/ChangeMessageStyle";

export const Container = styled(C.Container)``;

export const Content = styled(C.Content)`
  padding: 0.9375rem 2.5rem; /* 15px 40px */
  gap: 2.25rem; /* 36px */
`;

export const Title = styled(C.Title)`
  justify-content: flex-start;
`;

export const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.9375rem; /* 15px */
`;

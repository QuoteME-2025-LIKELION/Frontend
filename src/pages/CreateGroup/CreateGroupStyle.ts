import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  position: relative;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.625rem; /* 26px */
  background-color: #fff;
  flex: 1; /* 남은 공간을 모두 차지하도록 변경 */
  overflow: hidden; /* 내부 스크롤 관리를 위해 추가 */
`;

export const NavyBox = styled.div`
  width: 100%;
  background-color: ${theme.colors.primary};
  padding: 2.625rem 2.5rem 1.25rem; /* 42px 40px 20px */
  display: flex;
  flex-direction: column;
  gap: 1.625rem; /* 26px */
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 12px */
`;

export const InputBox = styled(InputContainer)`
  gap: 0.5625rem; /* 9px */

  div {
    ${theme.fonts.pretendard}
    color: ${theme.colors.territory};
    font-size: 0.8125rem; /* 13px */
    font-weight: 400;
    letter-spacing: -0.26px;
  }
`;

export const ErrorMsg = styled.div`
  color: ${theme.colors.red} !important;
`;

export const Main = styled.div`
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* 20px */
  padding: 0 2.5rem; /* 0 40px */
  flex: 1; /* 남은 공간을 모두 차지하도록 변경 */
  overflow: hidden; /* 내부 스크롤 관리를 위해 추가 */
  padding-bottom: 3.75rem; /* 60px */
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3125rem; /* 5px */
`;

export const TitleLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4375rem; /* 7px */
`;

export const Title = styled.div`
  ${theme.fonts.batang}
  font-size: 1rem; /* 16px */
  text-align: center;
  color: #000;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const InviteCount = styled.div`
  ${theme.fonts.pretendard}
  font-size: 0.875rem; /* 14px */
  color: ${theme.colors.territory};
  font-weight: 500;
  letter-spacing: -0.28px;
`;

export const Desc = styled(InviteCount)`
  font-size: 0.8125rem; /* 13px */
  font-weight: 400;
  letter-spacing: -0.26px;
`;

export const FriendListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 0 -2.5rem; /* Main의 padding을 무시하고 채우기 */
  padding: 0 2.5rem; /* 0 40px */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FriendList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EmptyFriendContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem; /* 20px */
`;

export const EmptyFriendList = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3125rem; /* 5px */

  button,
  div {
    ${theme.fonts.pretendard}
    font-size: 0.8125rem; /* 13px */
    letter-spacing: -0.26px;
  }

  button {
    color: #000;
    text-decoration-line: underline;
    font-weight: 500;
    text-underline-position: from-font;
    background-color: transparent;

    &:active {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  div {
    color: ${theme.colors.territory};
    font-weight: 400;
  }
`;

export const BtnBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.9375rem 2.5rem; /* 15px 40px */
  background-color: #fff;
  position: absolute;
  bottom: 0;
`;

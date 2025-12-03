import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  background-color: #fff;
  height: 100vh;
`;

export const Content = styled.div`
  width: 100%;
  padding: 0.9375rem 2.5rem; /* 15px 40px */
  display: flex;
  flex-direction: column;
  gap: 2.25rem; /* 36px */
  height: 100%;
  max-height: calc(100vh - 59px);
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.9375rem; /* 15px */
`;

export const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${theme.fonts.batang}
  color: #000;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const BtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9375rem; /* 15px */

  button {
    ${theme.fonts.pretendard}
    color: ${theme.colors.territory};
    font-size: 0.8125rem; /* 13px */
    font-weight: 400;
    letter-spacing: -0.26px;
    text-align: center;
    text-decoration-line: underline;

    &:active {
      color: #000;
    }
  }
`;

export const GroupContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-wrap: nowrap;
  overflow-x: scroll;
  gap: 1.25rem; /* 20px */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const GroupBox = styled.button`
  padding: 0.875rem 0.9375rem; /* 14px 15px */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem; /* 10px */
  border-radius: 0 0 1.875rem 0; /* 0 0 30px 0 */
  border-top: 0.5px solid #000;
  border-bottom: 0.5px solid #000;
  background-color: #fff;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
  white-space: nowrap;
`;

export const GroupName = styled.div`
  width: 2.5rem; /* 40px */
  font-family: "HCR Batang", serif;
  line-height: 1;
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  letter-spacing: -0.28px;
  color: #000;
  word-break: keep-all;
  text-align: center;
  white-space: normal;
`;

export const GroupCount = styled.div`
  ${theme.fonts.chonburi}
  font-size: 6rem; /* 96px */
  font-weight: 400;
  letter-spacing: -1.92px;
  color: #ddd;
`;

export const FriendList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

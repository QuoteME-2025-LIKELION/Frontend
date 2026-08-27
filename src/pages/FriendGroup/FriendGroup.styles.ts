import styled from "@emotion/styled";

import {
  RequestActionBoxBase,
  RequestDefaultProfileImgBase,
  RequestIntroBase,
  RequestItemBase,
  RequestProfileImgBase,
  RequestUserBoxBase,
  RequestUsernameBase,
} from "@/styles/requestItem.styles";
import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  background-color: ${theme.colors.secondary};
  height: 100vh;
`;

export const Content = styled.div`
  width: 100%;
  padding: 0.9375rem 1.5rem 2rem; /* 15px 24px 32px */
  display: flex;
  flex-direction: column;
  gap: 2.375rem; /* 38px */
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
    text-underline-position: from-font;

    &:active {
      color: #000;
    }
  }
`;

export const HeaderIconButton = styled.button`
  width: 1.5rem; /* 24px */
  height: 1.5rem; /* 24px */
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
`;

export const GroupContainer = styled.div`
  width: calc(100% + 3rem);
  min-height: 7.5rem; /* 120px */
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-wrap: nowrap;
  overflow-x: scroll;
  gap: 0.75rem; /* 12px */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const GroupBox = styled.button`
  position: relative;
  flex: 0 0 8.75rem; /* 140px */
  width: 8.75rem;
  height: 7.5rem; /* 120px */
  padding: 0 1.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  border-radius: 1.5rem 0 1.5rem 0; /* 24px 0 24px 0 */
  background-color: ${theme.colors.primary};
`;

export const GroupName = styled.div`
  position: relative;
  z-index: 1;
  width: 4rem; /* 64px */
  font-family: "HCR Batang", serif;
  line-height: 1.35;
  font-size: 0.875rem; /* 14px */
  font-weight: 700;
  letter-spacing: -0.28px;
  color: #fff;
  word-break: keep-all;
  text-align: center;
  white-space: normal;
`;

export const GroupCount = styled.div`
  position: absolute;
  right: 1.125rem;
  top: 2.125rem;
  ${theme.fonts.bombaram}
  font-size: 4.25rem; /* 68px */
  font-weight: 400;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.18);
`;

export const FriendList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const AddGuideText = styled.div`
  margin: 3rem 0 3.5rem;
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: -0.28px;
  text-align: center;
`;

export const RequestItem = styled(RequestItemBase)``;

export const RequestProfileImg = styled(RequestProfileImgBase)``;

export const RequestDefaultProfileImg = styled(RequestDefaultProfileImgBase)``;

export const RequestUserBox = styled(RequestUserBoxBase)``;

export const RequestUsername = styled(RequestUsernameBase)``;

export const RequestIntro = styled(RequestIntroBase)``;

export const RequestActionBox = styled(RequestActionBoxBase)``;

export const EmptyBox = styled.div`
  width: 100%;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem; /* 10px */
  text-align: center;
`;

export const EmptyTitle = styled.div`
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 0.9375rem; /* 15px */
  font-weight: 500;
  letter-spacing: -0.3px;
`;

export const EmptyDescription = styled.div`
  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 0.8125rem; /* 13px */
  font-weight: 400;
  letter-spacing: -0.26px;
`;

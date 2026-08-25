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
  height: 100vh;
  overflow: hidden;
  background-color: ${theme.colors.secondary};
`;

export const Content = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const GrayBox = styled.div`
  width: 100%;
  padding: 2.125rem 1.5rem 1.75rem; /* 34px 24px 28px */
  background-color: ${theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* GroupCard 컴포넌트 오버라이딩 */
export const GroupCard = styled.div`
  position: relative;
  width: 100%;
  min-height: 9.25rem; /* 148px */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: transparent;
  height: 100%;
`;

export const TextBox = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.625rem; /* 26px */
  height: 100%;
  justify-content: space-between;
`;

export const GroupTitle = styled.div`
  ${theme.fonts.batang}
  color: #fff;
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  letter-spacing: -0.4px;
`;

export const Title = styled.div`
  ${theme.fonts.batang}
  color: #000;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.32px;
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 12px */
`;

export const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */

  ${theme.fonts.pretendard}
  color: #fff;
  font-size: 0.875rem; /* 14px */
  letter-spacing: -0.28px;

  strong {
    font-weight: 700;
  }

  span {
    font-weight: 400;
  }
`;

export const Since = styled.div`
  position: relative;
  z-index: 1;
  ${theme.fonts.batang}
  color: #fff;
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  letter-spacing: -0.4px;
`;

export const Count = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  ${theme.fonts.chonburi}
  color: rgba(255, 255, 255, 0.22);
  font-size: 6rem; /* 96px */
  font-weight: 400;
  letter-spacing: 0;
`;

export const Main = styled(Content)`
  flex: 1;
  width: 100%;
  min-height: 0;
  padding: 2.125rem 1.5rem 2rem; /* 34px 24px 32px */
  gap: 2.625rem; /* 42px */
  background-color: ${theme.colors.secondary};
  overflow-y: auto;
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9375rem; /* 15px */
`;

export const MemberList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const MessageBox = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 3rem; /* 48px */
  padding: 0.625rem 1.5rem; /* 10px 24px */
  background-color: ${theme.colors.primary};
  border-radius: 0.75rem 0 0.75rem 0; /* 12px 0 12px 0 */
  gap: 0.3125rem; /* 5px */

  div {
    ${theme.fonts.batang}
    font-weight: 500;
  }
`;

export const Quotation = styled.div`
  font-size: 2.5rem; /* 40px */
  letter-spacing: -0.8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0.9rem);
  color: #fff;
  height: 1rem; /* 16px */
`;

export const Text = styled.div`
  font-size: 1rem; /* 16px */
  letter-spacing: -0.28px;
  color: #fff;
`;

export const EmptyText = styled(Text)`
  color: rgba(255, 255, 255, 0.5);
`;

export const EmptyMemberBox = styled.div`
  min-height: 12.5rem; /* 200px */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem; /* 16px */
  text-align: center;

  strong {
    ${theme.fonts.batang}
    color: ${theme.colors.territory};
    font-size: 1.25rem; /* 20px */
    font-weight: 700;
    letter-spacing: -0.4px;
  }

  span {
    ${theme.fonts.pretendard}
    color: ${theme.colors.territory};
    font-size: 0.875rem; /* 14px */
    font-weight: 500;
    letter-spacing: -0.28px;
  }
`;

export const BtnBox = styled(Section)`
  margin-top: auto;
  gap: 0;
`;

export const InviteButton = styled.button<{ $isDisabled: boolean }>`
  width: 100%;
  min-height: 2.875rem; /* 46px */
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 0.5px solid
    ${({ $isDisabled }) => ($isDisabled ? "#dedede" : theme.colors.primary)};

  ${theme.fonts.pretendard}
  color: ${({ $isDisabled }) =>
    $isDisabled ? "#c3c5c9" : theme.colors["fg-primary"]};
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: -0.28px;

  &:active:not(:disabled) {
    background-color: rgba(20, 56, 88, 0.08);
  }
`;

export const RequestList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const RequestItem = styled(RequestItemBase)``;

export const RequestProfileImg = styled(RequestProfileImgBase)``;

export const RequestDefaultProfileImg = styled(RequestDefaultProfileImgBase)``;

export const RequestUserBox = styled(RequestUserBoxBase)``;

export const RequestUsername = styled(RequestUsernameBase)``;

export const RequestIntro = styled(RequestIntroBase)``;

export const RequestActionBox = styled(RequestActionBoxBase)``;

export const QuitBtn = styled.button<{
  $hasTopBorder?: boolean;
  $isTopBorderDisabled?: boolean;
}>`
  width: 100%;
  min-height: 2.875rem; /* 46px */
  padding: 0.4375rem 0.625rem; /* 7px 10px */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;

  ${theme.fonts.pretendard}
  color: ${theme.colors.red};
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: -0.28px;
  text-align: center;
  border-top: ${({ $hasTopBorder }) =>
    $hasTopBorder ? "0.5px solid" : 0};
  border-top-color: ${({ $isTopBorderDisabled }) =>
    $isTopBorderDisabled ? "#dedede" : theme.colors.primary};
`;

import theme from "@/styles/theme";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  position: relative;
`;
export const Toggle = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 0;
  right: 0;

  width: 270px; /* 피그마 보고 조절 */
  height: 100vh;

  z-index: 999;

  display: flex;
  align-items: center;
  flex-direction: column;

  background: var(--bg-basement-neutral, #e9eaec);
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);

  animation: ${({ $active }) => ($active ? fadeIn : fadeOut)} 0.3s ease-out
    forwards;
`;

export const ToggleBtn = styled.div`
  cursor: pointer;
  color: ${theme.colors["fg-primary"]};
  font-size: 18px; /* 14px */
  font-weight: 700;
  letter-spacing: -0.28px;
  ${theme.fonts.batang}
  &:hover, &:active {
    color: black;
  }

  padding: var(--spacing-padding-md, 20px) 0;
  text-align: center;
  width: 240px;
  border-bottom: 0.5px solid var(--stroke-subtle, #c3c5c9);
`;

export const TagRequestModal = styled.div``;

export const ToggleWrapper = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
`;

export const ImgBox = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const ImgPreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 80px;
  background-color: #e0e0e0;
  background-size: cover; /* 이미지 크기 조절 */
  background-position: center; /* 이미지 위치 조절 */
  display: flex;
`;

export const UserName = styled.div`
  color: ${theme.colors["fg-primary"]};
  text-align: center;
  ${theme.fonts.batang};
  font-size: 16px;
  font-weight: 700;
  margin-top: 12px;
`;

export const UserIntro = styled.div`
  color: ${theme.colors["fg-subtle"]};
  text-align: center;
  ${theme.fonts.pretendard};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.24px;
  margin-top: 4px;
`;

export const ToggleBtnBox = styled.div`
  margin-top: 55px;
`;

export const ToggleInfoBox = styled.div`
  margin-top: 240px;
  gap: 12px;
  display: flex;
  flex-direction: column;
`;

export const ToggleInfoText = styled.div`
  color: var(--fg-subtle, #9599a1);
  text-align: center;

  /* button/xs */
  font-family: Pretendard;
  font-size: var(--font-size-t1, 12px);
  font-style: normal;
  font-weight: var(--font-weight-medium, 500);
  line-height: var(--line-height-t1, 18px); /* 150% */
  letter-spacing: -0.24px;
`;
export const CopyToast = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  bottom: 50px;
  width: 343px;
  padding: var(--spacing-padding-lg, 16px) var(--spacing-padding-xl, 24px);
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-gap-xl, 24px);

  border-radius: var(--spacing-radius-sm, 4px);
  background: var(--bg-neutral, #e9eaec);

  /* global-shadow */
  box-shadow: 0 0 10px 0 rgba(20, 56, 88, 0.16);
`;

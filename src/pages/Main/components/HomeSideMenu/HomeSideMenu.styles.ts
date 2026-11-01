import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import theme from "@/styles/theme";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
`;

const toastIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const toastOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(12px);
  }
`;

export const ToggleWrapper = styled.dialog`
  position: fixed;
  width: 100%;
  max-width: 393px;
  height: 100%;
  max-height: none;
  margin: 0 auto;
  padding: 0;
  border: 0;
  color: inherit;
  overflow: clip;
  inset: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.45);

  &:not([open]) {
    display: none;
  }

  &::backdrop {
    background: transparent;
  }
`;

export const Toggle = styled.div<{ $active: boolean }>`
  > * {
    flex-shrink: 0;
  }

  position: absolute;
  top: 0;
  right: 0;

  width: 270px; /* 피그마 보고 조절 */
  height: 100%;
  overflow-y: auto;

  z-index: 999;

  display: flex;
  align-items: center;
  flex-direction: column;

  background: var(--bg-basement-neutral, ${theme.colors.secondary});
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);

  animation: ${({ $active }) => ($active ? fadeIn : fadeOut)} 0.3s ease-out
    both;
`;

export const ImgBox = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ImgPreview = styled.div<{ $profileImage?: string }>`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 80px;
  background-color: ${theme.colors["grey-100"]};
  background-image: ${({ $profileImage }) =>
    $profileImage ? `url(${$profileImage})` : "none"};
  background-size: cover; /* 이미지 크기 조절 */
  background-position: center; /* 이미지 위치 조절 */
  display: flex;
`;

export const ProfileSettingButton = styled.button`
  position: absolute;
  top: 0;
  right: -24px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    display: block;
  }
`;

export const UserName = styled.div`
  color: ${theme.colors["grey-950"]};
  text-align: center;
  ${theme.fonts.batang};
  font-size: 16px;
  font-weight: 700;
  margin-top: 12px;
`;

export const UserIntro = styled.div`
  color: ${theme.colors["grey-400"]};
  text-align: center;
  ${theme.fonts.pretendard};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.24px;
  margin-top: 10px;
`;

export const ToggleBtnBox = styled.div`
  margin-top: 55px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ToggleBtn = styled.button`
  cursor: pointer;
  color: ${theme.colors["grey-950"]};
  background: transparent;
  border: 0;
  font-size: 18px; /* 14px */
  font-weight: 700;
  letter-spacing: -0.28px;
  ${theme.fonts.batang}
  &:hover, &:active {
    color: ${theme.colors.black};
  }

  padding: var(--spacing-padding-md, 20px) 0;
  text-align: center;
  width: 240px;
  border-bottom: 0.5px solid var(--stroke-subtle, ${theme.colors["grey-200"]});

  &:last-of-type {
    border-bottom: none;
  }
`;

export const ToggleInfoBox = styled.div`
  margin-top: auto;
  margin-bottom: 52px;
  gap: 12px;
  display: flex;
  flex-direction: column;
`;

export const ToggleInfoRow = styled.div`
  display: flex;
  gap: 4px;
`;

export const ToggleInfoText = styled.div`
  color: var(--fg-subtle, ${theme.colors["grey-400"]});
  text-align: center;

  /* button/xs */
  font-family: Pretendard;
  font-size: var(--font-size-t1, 12px);
  font-style: normal;
  font-weight: var(--font-weight-medium, 500);
  line-height: var(--line-height-t1, 18px); /* 150% */
  letter-spacing: -0.24px;
`;

export const CopyMailText = styled.button`
  color: var(--fg-subtle, ${theme.colors["grey-400"]});
  text-align: center;
  font-family: Pretendard;
  font-size: var(--font-size-t1, 12px);
  font-style: normal;
  font-weight: var(--font-weight-medium, 500);
  line-height: var(--line-height-t1, 18px);
  letter-spacing: -0.24px;
  cursor: pointer;
`;

export const CopyToast = styled.div`
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  justify-content: center;
  bottom: 58px;
  padding: var(--spacing-padding-lg, 16px) var(--spacing-padding-xl, 24px);
  flex-direction: column;
  align-items: flex-start;
  min-height: 3.25rem;

  border-radius: var(--spacing-radius-sm, 4px);
  background: ${theme.colors["grey-00"]};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  animation:
    ${toastIn} 0.3s ease-out,
    ${toastOut} 0.3s ease-in 1.7s forwards;

  ${theme.fonts.pretendard};
  color: ${theme.colors.black};
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.3px;
  word-break: keep-all;
`;

import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  background-color: ${theme.colors.secondary};
`;

export const InputBox = styled.div`
  width: 100%;
  padding: 0 2.5rem; /* 0 40px */
  display: flex;
  flex-direction: column;
  margin-top: 26px;
  gap: 9px;
  display: flex;
  padding: var(--spacing-section-default, 32px) var(--spacing-padding-xl, 24px);
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-section-default, 32px);
`;

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  width: 100%;
`;

export const ImgPreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 80px;
  background-color: #e0e0e0;
  background-size: cover; /* 이미지 크기 조절 */
  background-position: center; /* 이미지 위치 조절 */
`;

export const ImgInput = styled.div`
  ${theme.fonts.pretendard};
  color: ${theme.colors.territory};
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
  text-underline-position: from-font;
  cursor: pointer;
`;
export const StepText = styled.div`
  color: ${theme.colors["fg-primary"]};
  ${theme.fonts.batang};
  font-size: var(--font-size-t5, 20px);
  font-style: normal;
  font-weight: var(--font-weight-medium, 500);
  line-height: var(--line-height-t5, 30px); /* 150% */
  letter-spacing: -0.2px;
  align-self: stretch;
`;

export const ExText = styled.div`
  color: ${theme.colors["fg-primary"]};

  /* title/lg */
  ${theme.fonts.batang}
  font-size: var(--font-size-t5, 20px);
  font-style: normal;
  font-weight: var(--font-weight-bold, 700);
  line-height: var(--line-height-t5, 30px); /* 150% */
`;

export const exText = styled.div`
  color: var(--fg-subtle, #9599a1);

  /* caption/description/md */
  ${theme.fonts.pretendard}
  font-size: var(--font-size-t2, 14px);
  font-style: normal;
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--line-height-t2, 21px); /* 150% */
  letter-spacing: -0.28px;
`;

export const BtnBox = styled.div`
  width: 100%;
  padding: 0 2.5rem 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: auto;
  margin-bottom: 15%;
`;

export const TextBox = styled.div`
  gap: 0px;
`;

export const LimitText = styled.div``;

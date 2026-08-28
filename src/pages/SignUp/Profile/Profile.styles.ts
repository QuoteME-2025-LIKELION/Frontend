import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  background-color: ${theme.colors.secondary};
`;

export const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  padding: 5rem 1.5rem 0;

  > input {
    height: 2.875rem;
    padding: 0.75rem;
  }
`;

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding-top: 0.5rem;
`;

export const ImgPreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  background-size: cover; /* 이미지 크기 조절 */
  background-position: center; /* 이미지 위치 조절 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ImgInput = styled.div`
  ${theme.fonts.pretendard};
  color: ${theme.colors.territory};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
`;
export const StepText = styled.div`
  color: ${theme.colors["fg-primary"]};
  ${theme.fonts.batang};
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  align-self: stretch;
`;

export const ExText = styled.div`
  color: ${theme.colors["fg-primary"]};

  /* title/lg */
  ${theme.fonts.batang}
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5;
`;

export const exText = styled.div`
  color: var(--fg-subtle, #9599a1);

  /* caption/description/md */
  ${theme.fonts.pretendard}
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
`;

export const BtnBox = styled.div`
  width: 100%;
  padding: 0 1.5rem 4.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`;

export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const LimitText = styled.div`
  align-self: flex-end;
  margin-top: -1.5rem;
  ${theme.fonts.pretendard};
  color: ${theme.colors["fg-subtle"]};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.5;
`;

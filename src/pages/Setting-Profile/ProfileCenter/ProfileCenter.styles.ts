import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  min-height: 100vh;
  background-color: ${theme.colors.secondary};
`;

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  margin-top: 3rem;
`;

export const ImgPreview = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${theme.colors["grey-100"]};
  background-size: cover;
  background-position: center;
  flex: 0 0 80px;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

export const ImgInput = styled.button<{ $hidden?: boolean }>`
  ${theme.fonts.pretendard};
  color: ${theme.colors["grey-300"]};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;
  cursor: ${({ $hidden }) => ($hidden ? "default" : "pointer")};
  visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};
`;

export const InputBox = styled.div`
  width: 100%;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  margin-top: 2.125rem;
  gap: 0.875rem;
`;

export const InfoBox = styled.div`
  width: 100%;
  min-height: 3.25rem;
  padding: 0.625rem 0.9375rem;
  background-color: ${theme.colors.white};
  display: flex;
  align-items: center;

  ${theme.fonts.pretendard};
  color: ${theme.colors.black};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.28px;
  word-break: break-word;
`;

export const TextName = styled.div`
  ${theme.fonts.batang};
  color: ${theme.colors["grey-950"]};
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.36px;
  margin-top: 0.75rem;
`;

export const Field = styled.div<{ $error?: boolean }>`
  width: 100%;
  --input-focus-color: ${({ $error }) =>
    $error ? theme.colors.red : theme.colors.primary};

  input {
    border: 0.5px solid
      ${({ $error }) => ($error ? theme.colors.red : "transparent")};
    background-color: ${theme.colors.white};
  }
`;

export const FieldMeta = styled.div<{ $error?: boolean; $hidden?: boolean }>`
  min-height: 1.125rem;
  margin-top: -0.625rem;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: ${({ $error }) => ($error ? "space-between" : "flex-end")};
  gap: 0.75rem;
  ${theme.fonts.pretendard};
  color: ${({ $error }) =>
    $error ? theme.colors.red : theme.colors["grey-400"]};
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.24px;
  visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};

  span:last-of-type {
    margin-left: auto;
    color: ${theme.colors["grey-400"]};
  }
`;

export const BtnBox = styled.div`
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  bottom: 2.5rem;

  button:disabled {
    background-color: ${theme.colors.secondary};
  }
`;

import styled from "@emotion/styled";
import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
`;

export const InputBox = styled.div`
  width: 315px;
  display: flex;
  flex-direction: column;
  margin-top: 26px;
  gap: 9px;
`;

export const InfoBox = styled.div`
  width: 100%;
  height: 2.1875rem; /* 35px */
  padding: 0.625rem 0.9375rem; /* 10px 15px */
  background-color: ${theme.colors.secondary};
  border-top: 0.5px solid ${theme.colors.territory};
  border-bottom: 0.5px solid ${theme.colors.territory};
  display: flex;
  align-items: center;
  outline: none;

  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: -0.28px;
`;

export const InputBtn = styled.div`
  ${theme.fonts.batang};
  border-top: 0.5px solid ${theme.colors.territory};
  border-bottom: 0.5px solid ${theme.colors.territory};
  background: #fff;
  display: flex;
  padding: 7px 10px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  align-self: stretch;
  margin-top: 10px;
  cursor: pointer;
`;

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 43px;
`;

export const ImgPreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 80px;
  background-color: #e0e0e0;
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

export const TextName = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -0.28px;
`;

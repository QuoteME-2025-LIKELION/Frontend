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

export const InputBtn = styled.div`
  ${theme.fonts.chonburi};
  border-top: 0.5px solid #959595;
  border-bottom: 0.5px solid #959595;
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
  color: #959595;
  font-size: 14px;
  text-decoration: underline;
  text-underline-position: from-font;
  cursor: pointer;
`;
export const LimitText = styled.div`
  color: #959595;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 3px;
`;

export const TextName = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -0.28px;
  margin-top: 3px;
`;

export const SaveBanner = styled.div`
  display: flex;
  width: 266px;
  height: 55px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  gap: 10px;
  border-radius: 30px;
  border: 1px solid #959595;
  background: #f3f3f3;
  margin-top: 40px;
`;

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
  width: 100%;
  padding: 0 2.5rem; /* 0 40px */
  display: flex;
  flex-direction: column;
  margin-top: 26px;
  gap: 9px;
`;

// export const InputBtn = styled.div`
//   ${theme.fonts.batang};
//   border-top: 0.5px solid ${theme.colors.territory};
//   border-bottom: 0.5px solid ${theme.colors.territory};
//   background: #fff;
//   display: flex;
//   padding: 7px 10px;
//   justify-content: center;
//   align-items: center;
//   font-weight: 700;
//   align-self: stretch;
//   margin-top: 81px;
//   cursor: pointer;
// `;

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
export const LimitText = styled.div`
  color: ${theme.colors.territory};
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  ${theme.fonts.pretendard}
  margin-bottom: 3px;
`;

export const BtnBox = styled.div`
  width: 100%;
  padding: 0 2.5rem; /* 0 40px */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5rem; /* 80px */
`;

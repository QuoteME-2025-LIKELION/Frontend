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
  margin-top: 40px;
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

// export const InputBtn = styled.div`
//   ${theme.fonts.chonburi};
//   border-top: 0.5px solid ${theme.colors.territory};
//   border-bottom: 0.5px solid ${theme.colors.territory};
//   background: #fff;
//   display: flex;
//   padding: 7px 10px;
//   justify-content: center;
//   align-items: center;
//   font-weight: 700;
//   align-self: stretch;
//   margin-top: 10px;
//   cursor: pointer;
// `;

export const TextName = styled.div`
  color: #000;
  font-size: 14px;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -0.28px;
  margin-top: 3px;
  ${theme.fonts.pretendard}
`;

export const WarningMessage = styled.div`
  display: flex;
  justify-content: center;
  color: ${theme.colors.red};
  font-size: 13px;
  font-weight: 400;
  ${theme.fonts.pretendard}
`;

export const DeleteBtn = styled.button`
  color: ${theme.colors.red};
  text-align: start;
  font-size: 16px;
  font-weight: 300;
  text-decoration-line: underline;
  text-underline-position: from-font;
  margin-top: 40px;
  ${theme.fonts.pretendard}
`;

export const Select = styled.select`
  width: 100%;
  height: 2.1875rem; /* 35px */
  padding: 0.625rem 0.9375rem; /* 10px 15px */
  background-color: ${theme.colors.secondary};
  border: none;
  border-top: 0.5px solid ${theme.colors.territory};
  border-bottom: 0.5px solid ${theme.colors.territory};
  display: flex;
  align-items: center;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: -0.28px;

  background-image: url("https://img.icons8.com/ios-filled/50/sort-down.png");
  background-repeat: no-repeat;
  background-position: 96% center;
  background-size: 0.5rem;
`;

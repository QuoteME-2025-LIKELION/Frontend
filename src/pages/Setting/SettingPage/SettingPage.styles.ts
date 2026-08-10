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

export const SettingList = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 2rem 5rem; /* 16px 32px 80px */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div {
    width: 100%;
  }
`;

export const SettingBtn = styled.button`
  width: 100%;
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #ddd;
  align-self: stretch;

  ${theme.fonts.pretendard}
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 16px */
  letter-spacing: -0.32px;
`;

export const InputBtn = styled.div`
  ${theme.fonts.chonburi};
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

export const SettingWordLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 0.8125rem; /* 0 13px */
`;
export const SettingWord = styled.div`
  color: ${theme.colors.territory};
  font-size: 16px;
  font-weight: 500;
  ${theme.fonts.pretendard}
`;
export const LogOutBtn = styled.button`
  width: 100%;
  padding: 0.3125rem 0.8125rem 0; /* 5px 13px 0 */

  text-align: start;
  color: ${theme.colors.territory};
  font-weight: 500;
  font-size: 16px;
  text-decoration-line: underline;
  text-underline-position: from-font;
  ${theme.fonts.pretendard}
`;

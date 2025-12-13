import styled from "@emotion/styled";
import theme from "@/styles/theme";

export const Container = styled.div`
  background-color: ${() => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 240px;
`;

export const textbox = styled.div`
  padding: 10px 159px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;
export const Month = styled.div`
  color: #fff;
  text-align: center;
  ${theme.fonts.chonburi};
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 36px */
  letter-spacing: -0.72px;
`;

export const weekend = styled.div`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-family: KoPubWorldBatang;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 12px */
  letter-spacing: -0.24px;
`;

export const Wrapper = styled.button`
  display: flex;
  width: 100%;
  max-width: 393px;
  background-color: ${theme.colors.primary};
  padding: 20px 25px;
  padding-right: 0px;
  padding-top: 0px;
  align-items: flex-start;
  color: white;
  padding-bottom: 0px;
`;

export const Line = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
`;

export const Text = styled.div`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  ${theme.fonts.batang}
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  padding: 9px 20px;
`;

export const Left = styled.div`
  color: #fff;
  text-align: center;
  ${theme.fonts.chonburi}
  font-size: 75px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: -1.5px;
  padding: 0px 10px;
`;

export const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  display: flex;
  width: 100%;
  max-width: 393px;
  background-color: ${theme.colors.primary};
  padding: 20px 50px;
  align-items: flex-start;
  color: white;
  padding-bottom: 0px;
  padding-left: 5px;
`;

export const bottom = styled.div`
  width: 293.5px;
`;
export const Text2 = styled.div`
  color: #fff;
  ${theme.fonts.batang}
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
`;
export const BottomTextBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;
export const BottomBtn = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
`;

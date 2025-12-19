import styled from "@emotion/styled";
import theme from "@/styles/theme";

export const Container = styled.div`
  background-color: ${() => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
`;

export const textbox = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  width: calc(100% + 65px);
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
  margin-left: -65px;
`;

export const Text = styled.div<{ hasFeed: boolean }>`
  width: 100%;
  color: ${({ hasFeed }) => (hasFeed ? "#fff" : "rgba(255, 255, 255, 0.7)")};
  text-align: center;
  ${theme.fonts.batang}
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  padding: 9px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  min-height: 2.0625rem; /* 33px */
  max-height: 40px;
  max-width: 250px;
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
  width: 5.625rem; /* 90px */
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
  padding-left: 10px;
`;

export const bottom = styled.div`
  width: 100%;
  padding: 16px 50px 0 50px;
`;
export const Text2 = styled.div`
  color: #fff;
  ${theme.fonts.batang}
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
`;

export const TagList = styled.div`
  display: flex;
  gap: 0.3125rem; /* 5px */
  word-break: keep-all;
`;
export const BottomTextBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
export const BottomBtn = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 20px 0 10px;
`;

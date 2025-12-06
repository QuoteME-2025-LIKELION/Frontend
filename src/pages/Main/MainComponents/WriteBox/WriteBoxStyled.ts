import styled from "@emotion/styled";
import theme from "@/styles/theme";

export const Container = styled.div`
    background-color: ${() => theme.colors.primary};
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 393px;
    height: auto;
`;

export const Datebox = styled.div`
    padding: 10px;
    padding-top:0px ;
    gap: 8px;
    align-items: center;
`
export const Month = styled.div`
    color: #FFF;
    text-align: center;
    ${theme.fonts.chonburi};
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 36px */
    letter-spacing: -0.72px;
`

export const Weekend = styled.div`
    color: rgba(255, 255, 255, 0.60);
    text-align: center;
    ${theme.fonts.batang}
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    margin-top: 5px;
    line-height: 100%; /* 12px */
    letter-spacing: -0.24px;
`

export const Guide = styled.div`
    color: rgba(255, 255, 255, 0.60);
    text-align: center;
    font-family: KoPubWorldBatang;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 14.4px */
    letter-spacing: -0.24px;
    padding-top: 8px;
`
export const WriteBox = styled.div`
  padding-top: 26px;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;

  width: 327px; 
  height: 90px; 
`;

export const LineWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px; 
`;

export const Line = styled.div`
  width: 327px;
  height: 1px;
  background: #fff;
`;

export const TextArea = styled.textarea`
  position: absolute;
  top: 0px;
  left: 0;

  width: 327px;
  height: 100%;

  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 0px 5px;

  color: #fff;
  font-size: 12px;
  line-height: 32px !important;
  ${theme.fonts.pretendard}
  text-align: center;


  overflow: hidden;
  z-index: 2;
`;

export const BtnText = styled.div`
color: rgba(255, 255, 255, 0.70);
text-align: center;
${theme.fonts.batang};
font-size: 11px;
font-style: normal;
font-weight: 700;
line-height: 120%; /* 13.2px */
letter-spacing: -0.22px;
`
export const RecommendBtn= styled.button`
    display: flex;
    padding: 5px 10px;
    align-items: center;
    gap: 11px;
    border-radius: 5px;
    border: 0.5px solid rgba(255, 255, 255, 0.70);
    margin-top: 20px;
    margin-bottom: 15px;
`
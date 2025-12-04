
import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
    background-color: ${() => theme.colors.secondary};
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 393px;
    height: 100vh;
`;

export const Text = styled.div`
    color: #000;
    ${theme.fonts.batang}
    text-align: center;
    font-style: normal;
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.4px;
`

export const Commend = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 18px;
    background: #FFF;
    gap:19px;
    border-top: 0.5px solid #000;
    border-bottom: 0.5px solid #000;
    background: #FFF;
    width: 343px;
    margin-top: 26px;
`

export const FirstLine = styled.div`
    display: flex;
    gap: 18px;
`
export const SelectBtn = styled.button`
    display: flex;
    padding: 7px 10px;
    justify-content: center;
    align-self: stretch;

    border-top: 0.5px solid #959595;
    border-bottom: 0.5px solid #959595;
    background: #FFF;

    text-align: center;
    ${theme.fonts.batang}
    font-size: 16px;
    font-weight: 700;
    margin:22px 24px;
    
`
export const Text2 = styled.div`
color: #000;
text-align: center;
${theme.fonts.pretendard}
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 100%; /* 16px */
letter-spacing: -0.32px;
`
export const TagBox = styled.div`
    display: flex;
    padding: 10px 0;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    align-self: stretch;
    border-top: 0.5px solid #000;
    border-bottom: 0.5px solid #000;
    background: #FFF;
    margin: 22px 25px;
`
export const Line = styled.div`
width: 313px;
height: 1px;
background-color: ${theme.colors.territory};
`
export const TagList = styled.div`
    width: 100%;
    & > * {
    border-bottom: 1px solid #F3F3F3;
  }
`
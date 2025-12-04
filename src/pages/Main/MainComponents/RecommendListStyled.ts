
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

export const ComendList = styled.div`
    padding: 20px 35px;
    gap: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`
export const Head = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:19px;
    margin-top:26px;
`

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
    padding: 15px 0px;
    width: 344px;
    border-radius: 10px;
    border: 1px solid #143858;
    background: #FFF;
    gap:19px;
    

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
margin-top: 24px;
`
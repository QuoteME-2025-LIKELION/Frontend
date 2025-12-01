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
    display:flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
`

export const WarningMessage = styled.div`
    display: flex;
    justify-content: center;
    color: #DE1C1C;
    font-size: 13px;
    font-weight: 400;
`

export const InputBtn = styled.div`
   ${theme.fonts.chonburi};
    border-top: 0.5px solid #959595;
    border-bottom: 0.5px solid #959595;
    background: #FFF;
    display: flex;
    padding: 7px 10px;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    align-self: stretch;
    margin-top: 81px;
    cursor: pointer;
    `

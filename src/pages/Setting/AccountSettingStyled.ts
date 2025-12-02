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
    margin-top: 40px;
    gap: 9px;
`

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
    margin-top: 10px;
    cursor: pointer;
    `

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

export const WarningMessage = styled.div`
    display: flex;
    justify-content: center;
    color: #DE1C1C;
    font-size: 13px;
    font-weight: 400;
`

export const DeleteBtn = styled.button`
    color: #DE1C1C;
    text-align: start;
    font-size: 16px;
    font-weight: 300;
    text-decoration-line: underline;
    margin-top: 40px;
`
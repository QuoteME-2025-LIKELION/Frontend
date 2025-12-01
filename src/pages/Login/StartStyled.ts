import theme from "@/styles/theme";
import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 393px;
    background-color: ${() => theme.colors.primary};
    height: 100vh;
    justify-content: center;
`;

export const TextBox = styled.div``;
export const TittleText = styled.div`
    ${theme.fonts.chonburi};
    font-size: 48px;
    color: #FFF;
    text-align: center;
    font-weight: 400;
    line-height: 100%;
    padding-bottom: 23px;
`;
export const Text = styled.div`
    ${theme.fonts.pretendard};
    color: #FFF;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%;
    margin: 7px;
`;

export const Button = styled.div`
    display: flex;
    width: 260px;
    padding: 6px 10px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-top: 0.5px solid #959595;
    border-bottom: 0.5px solid #959595;
    background: #FFF;
    margin: 14px 0px;
`;

export const ButtonText = styled.div`
    ${theme.fonts.batang};
    color: #000;
    text-align: center;
    font-weight: 700;
`;

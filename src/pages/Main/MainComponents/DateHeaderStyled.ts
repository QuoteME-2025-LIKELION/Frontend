import styled from "@emotion/styled";
import theme from "@/styles/theme";

export const Container = styled.div`
    background-color: ${() => theme.colors.primary};
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 393px;
    height: 60px;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-self: stretch;
    padding: 20px 25px;
`;

export const IconBox = styled.div`
    display: flex;
    gap:7px
`;

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

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
`;

export const ComendList = styled.div`
  padding: 20px 25px;
  gap: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 19px;
  margin-top: 26px;
`;

export const Text = styled.div`
  color: #000;
  ${theme.fonts.batang}
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;
  letter-spacing: -0.4px;
`;

export const Commend = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #143858;
  background: #fff;
  gap: 15px;
  cursor: pointer;

  border: ${({ $isSelected }) =>
    $isSelected ? "1px solid #143858;" : "1px solid #959595;"};
`;

export const FirstLine = styled.div`
  display: flex;
  gap: 18px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
export const BtnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  margin-top: 24px;
`;

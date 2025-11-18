import RootLayout from "@/layouts/RootLayout";
import GlobalStyles from "@/styles/GlobalStyles";
import theme from "@/styles/theme";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";

// 테스트용. 추후 지울 예정
const FontTest = styled.div`
  font-family: "KoPubWorldBatang";
`;

function App() {
  return (
    <RootLayout>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <FontTest>QuoteMe 프론트엔드 레포지토리</FontTest>
      </ThemeProvider>
    </RootLayout>
  );
}

export default App;

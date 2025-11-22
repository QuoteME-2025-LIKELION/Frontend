import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home/Home";
import GlobalStyles from "@/styles/GlobalStyles";
import theme from "@/styles/theme";
import { ThemeProvider } from "@emotion/react";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <RootLayout>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          {/* 루트는 앞으로 이런 식으로 추가해나가면 됩니다 */}
          <Route path="/" element={<Home />} />
        </Routes>
      </ThemeProvider>
    </RootLayout>
  );
}

export default App;

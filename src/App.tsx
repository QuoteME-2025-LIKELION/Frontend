import Button from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import RootLayout from "@/layouts/RootLayout";
import GlobalStyles from "@/styles/GlobalStyles";
import theme from "@/styles/theme";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { Route, Routes } from "react-router-dom";

// 테스트용. 추후 지울 예정
const Test = styled.div`
  ${theme.fonts.dotum};
  margin-top: 1.25rem;
  padding: 0 2.4375rem; /* 39px */
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* 20px */
`;

function App() {
  return (
    <RootLayout>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* 추후 Home 컴포넌트로 변경 */}
                <Header
                  showBackBtn={true}
                  showXBtn={false}
                  title="로그인"
                  backgroundColor="white"
                  onClickBackBtn={() => {}}
                  onClickXBtn={() => {}}
                />
                <Test>
                  <Input placeholder="이메일 입력" />
                  <div>QuoteMe 프론트엔드 레포지토리</div>
                  <Button
                    title="입력 완료"
                    onClick={() => {}}
                    disabled={false}
                  />
                </Test>
              </>
            }
          />
        </Routes>
      </ThemeProvider>
    </RootLayout>
  );
}

export default App;

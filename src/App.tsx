import ToastModal from "@/components/ToastModal/ToastModal";
import Button from "@/components/Button/Button";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import Search from "@/components/Search/Search";
import RootLayout from "@/layouts/RootLayout";
import GlobalStyles from "@/styles/GlobalStyles";
import theme from "@/styles/theme";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Feed from "@/components/Feed/Feed";
import List from "@/components/List/List";

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
  // const [visible, setVisible] = useState(true);
  const tagList = ["듀듀", "무니니", "호롤롤로", "테스트", "안녕"];
  return (
    <RootLayout>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* {visible && (
                  <ConfirmModal
                    nickname="듀듀"
                    question="님을"
                    nickname2="무니니"
                    question2="에 초대할까요?"
                    onClose={() => setVisible(false)}
                    onConfirm={() => {}}
                    showOverlay={true}
                  />
                )} */}
                {/* <ToastModal
                  text="그룹원이"
                  redText="5인을 초과"
                  text2="하여"
                  text3="초대가 불가능합니다."
                  showOverlay={false}
                /> */}
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
                  <Search
                    placeholder="검색"
                    desc="이메일, 닉네임, 그룹명으로 계정을 검색할 수 있어요."
                  />
                  <Feed
                    profileImgUrl="https://avatars.githubusercontent.com/u/189887138?v=4"
                    username="테스트"
                    intro="안녕하세요"
                    timestamp="방금 전"
                    text="30자이내로만쓸수있도록하겠죠아마?30자이내로만쓸수있도록"
                    tag={tagList}
                    isMine={false}
                    onAdd={() => {}}
                    onLike={() => {}}
                    onShare={() => {}}
                    isMyName={(name: string) => name === "듀듀"}
                    onRequest={() => {}}
                    onPoke={() => {}}
                    isInArchive={false}
                    onArchiveClick={() => {}}
                    year={2002}
                  />
                  <List
                    profileImgUrl="https://avatars.githubusercontent.com/u/189887138?v=4"
                    username="테스트"
                    intro="안녕하세요"
                    isSelectable={true}
                    isSelected={true}
                    onSelect={() => {}}
                    actionButton={{
                      type: "delete",
                      text: "삭제",
                      onClick: () => {},
                    }}
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

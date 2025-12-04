import RootLayout from "@/layouts/RootLayout";
import Archive from "@/pages/Archive/Archive";
import CalendarPage from "@/pages/Archive/Calendar/CalendarPage";
import Likes from "@/pages/Archive/Likes/Likes";
import MyQuotes from "@/pages/Archive/MyQuotes/MyQuotes";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login/Login";
import SignUp from "@/pages/Login/SignUp";
import Start from "@/pages/Login/Start";
import Profile from "@/pages/Login/Profile"
import ProfileCenterX from "@/pages/Setting-Profile/ProfileCenter(X)";
import ProfileCenterB from "@/pages/Setting-Profile/ProfileCenter(B)";
import ProfileEdit from "@/pages/Setting-Profile/ProfileEdit";
import SettingPage from "@/pages/Setting/SettingPage";
import GlobalStyles from "@/styles/GlobalStyles";
import theme from "@/styles/theme";
import { ThemeProvider } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import AccountSetting from "@/pages/Setting/AccountSetting";
import MainHome from "@/pages/Main/MainHome";
import MainWrite from "@/pages/Main/MainWrite";

function App() {
  return (
    <RootLayout>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          {/* 루트는 앞으로 이런 식으로 추가해나가면 됩니다 */}
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />}>
            <Route index element={<CalendarPage />} />
            <Route path="my-quotes" element={<MyQuotes />} />
            <Route path="likes" element={<Likes />} />
          </Route>

          <Route path="/start" element={<Start/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/profile-centerX" element={<ProfileCenterX/>}/>
          <Route path="/profile-centerB" element={<ProfileCenterB/>}/>
          <Route path="/profile-edit" element={<ProfileEdit/>}/>
          <Route path="/setting-page" element={<SettingPage/>}/>
          <Route path="/account-setting" element={<AccountSetting/>}/>
          <Route path="/main-home" element={<MainHome/>}/>
          <Route path="/main-write" element={<MainWrite/>}/>
        </Routes>
      </ThemeProvider>
    </RootLayout>
  );
}

export default App;

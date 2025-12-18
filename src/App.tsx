import { ThemeProvider } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import RootLayout from "@/layouts/RootLayout";
import GlobalStyles from "@/styles/GlobalStyles";
import theme from "@/styles/theme";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import useAuthStore from "@/stores/useAuthStore";
import useNotificationStore from "@/stores/useNotificationStore";

import Start from "@/pages/Start/Start";
import SignUp from "@/pages/SignUp/SignUp";
import Profile from "@/pages/SignUp/Profile/Profile";
import Login from "@/pages/Login/Login";

import MainHome from "@/pages/Main/MainHome";
import MainWrite from "@/pages/Main/MainWrite";

import Archive from "@/pages/Archive/Archive";
import CalendarPage from "@/pages/Archive/Calendar/CalendarPage";
import Likes from "@/pages/Archive/Likes/Likes";
import MyQuotes from "@/pages/Archive/MyQuotes/MyQuotes";
import Notification from "@/pages/Notification/Notification";

import ProfileCenter from "@/pages/Setting-Profile/ProfileCenter/ProfileCenter";
import ProfileEdit from "@/pages/Setting-Profile/ProfileEdit/ProfileEdit";
import SettingPage from "@/pages/Setting/SettingPage/SettingPage";
import AccountSetting from "@/pages/Setting/AccountSetting/AccountSetting";

import FriendGroup from "@/pages/FriendGroup/FriendGroup";
import MyGroups from "@/pages/FriendGroup/pages/MyGroups";
import Group from "@/pages/Group/Group";
import JoinGroup from "@/pages/FriendGroup/pages/JoinGroup";
import Invite from "@/pages/Group/pages/Invite/Invite";
import ChangeMessage from "@/pages/Group/pages/ChangeMessage/ChangeMessage";
import CreateGroup from "@/pages/CreateGroup/CreateGroup";

import NotFound from "@/pages/NotFound/NotFound";

import Spinner from "@/components/Spinner/Spinner";

function App() {
  const { isLoading, isAuthenticated, initializeAuth } = useAuthStore(); // 로그인 상태 관리
  const { fetchNotifications } = useNotificationStore(); // 알림 상태 관리

  useEffect(() => {
    // 앱 시작 시 인증 상태 초기화 (로컬 스토리지 토큰 확인)
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // 인증 상태가 true가 되고 (isLoading이 false가 된 후) 알림 가져오기
    if (!isLoading && isAuthenticated) {
      fetchNotifications();
    }
  }, [isLoading, isAuthenticated, fetchNotifications]);

  if (isLoading) {
    return <Spinner />; // 로딩 중일 때 스피너 표시
  }

  return (
    <RootLayout>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />

          {/* 인증이 필요한 페이지  */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home/:date?" element={<MainHome />} />
            <Route path="/write" element={<MainWrite />} />

            <Route path="/archive" element={<Archive />}>
              <Route index element={<CalendarPage />} />
              <Route path="my-quotes" element={<MyQuotes />} />
              <Route path="likes" element={<Likes />} />
            </Route>
            <Route path="/notification" element={<Notification />} />

            <Route path="/profile-center" element={<ProfileCenter />} />
            <Route path="/profile-edit" element={<ProfileEdit />} />
            <Route path="/setting-page" element={<SettingPage />} />
            <Route path="/account-setting" element={<AccountSetting />} />

            <Route path="/friend-group" element={<FriendGroup />} />
            <Route path="/my-groups" element={<MyGroups />} />
            <Route path="/create-group" element={<CreateGroup />} />

            <Route path="/join-group/:groupId" element={<JoinGroup />} />

            <Route path="/group/:groupId">
              <Route index element={<Group />} />
              <Route path="invite" element={<Invite />} />
              <Route path="change-message" element={<ChangeMessage />} />
            </Route>
          </Route>

          {/* 정의되지 않은 모든 경로는 NotFound 페이지 렌더링 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </RootLayout>
  );
}

export default App;

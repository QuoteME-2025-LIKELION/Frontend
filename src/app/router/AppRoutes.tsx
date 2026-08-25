import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/layouts/ProtectedRoute";
import OAuthCallback from "@/OAuthCallback";
import Archive from "@/pages/Archive/Archive";
import Bookmarks from "@/pages/Archive/Bookmarks/Bookmarks";
import CalendarPage from "@/pages/Archive/Calendar/CalendarPage";
import Likes from "@/pages/Archive/Likes/Likes";
import MyQuotes from "@/pages/Archive/MyQuotes/MyQuotes";
import CreateGroup from "@/pages/CreateGroup/CreateGroup";
import FriendGroup from "@/pages/FriendGroup/FriendGroup";
import FriendGroupAdd from "@/pages/FriendGroup/pages/FriendGroupAdd";
import Group from "@/pages/Group/Group";
import ChangeMessage from "@/pages/Group/pages/ChangeMessage/ChangeMessage";
import Invite from "@/pages/Group/pages/Invite/Invite";
import Login from "@/pages/Login/Login";
import EditQuoteTags from "@/pages/Main/EditQuoteTags/EditQuoteTags";
import Home from "@/pages/Main/Home";
import Write from "@/pages/Main/Write";
import NotFound from "@/pages/NotFound/NotFound";
import Notification from "@/pages/Notification/Notification";
import AccountSetting from "@/pages/Setting/AccountSetting/AccountSetting";
import Notice from "@/pages/Setting/Notice/Notice";
import NotificationSetting from "@/pages/Setting/NotificationSetting/NotificationSetting";
import SettingPage from "@/pages/Setting/SettingPage/SettingPage";
import ProfileCenter from "@/pages/Setting-Profile/ProfileCenter/ProfileCenter";
import ProfileEdit from "@/pages/Setting-Profile/ProfileEdit/ProfileEdit";
import Profile from "@/pages/SignUp/Profile/Profile";
import Start from "@/pages/Start/Start";

/**
 * 앱 전체 라우트
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* 인증 없이 접근 가능한 진입/인증 플로우 라우트 */}
      <Route path="/" element={<Start />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth2/callback" element={<OAuthCallback />} />

      {/* 로그인 상태가 필요한 화면 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home/:date?" element={<Home />} />
        <Route path="/write" element={<Write />} />
        <Route path="/fix" element={<EditQuoteTags />} />
        <Route path="/archive" element={<Archive />}>
          <Route index element={<CalendarPage />} />
          <Route path="my-quotes" element={<MyQuotes />} />
          <Route path="likes" element={<Likes />} />
          <Route path="bookmarks" element={<Bookmarks />} />
        </Route>
        <Route path="/notification" element={<Notification />} />

        <Route path="/profile-center" element={<ProfileCenter />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
        <Route path="/setting-page" element={<SettingPage />} />
        <Route path="/account-setting" element={<AccountSetting />} />
        <Route path="/notification-setting" element={<NotificationSetting />} />
        <Route path="/notices" element={<Notice />} />

        <Route path="/friend-group" element={<FriendGroup />} />
        <Route path="/friend-group/add" element={<FriendGroupAdd />} />
        <Route path="/create-group" element={<CreateGroup />} />

        <Route path="/group/:groupId">
          <Route index element={<Group />} />
          <Route path="invite" element={<Invite />} />
          <Route path="change-message" element={<ChangeMessage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

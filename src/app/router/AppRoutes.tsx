import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import OAuthCallback from "@/OAuthCallback";
import Start from "@/pages/Start/Start";
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
import EditQuoteTags from "@/pages/Main/EditQuoteTags/EditQuoteTags";
import NotFound from "@/pages/NotFound/NotFound";

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
        <Route path="/home/:date?" element={<MainHome />} />
        <Route path="/write" element={<MainWrite />} />
        <Route path="/fix" element={<EditQuoteTags />} />
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

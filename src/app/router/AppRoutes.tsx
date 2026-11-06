import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Spinner from "@/components/Spinner/Spinner";
import GuestRoute from "@/layouts/GuestRoute";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import OAuthCallback from "@/OAuthCallback";
import NotFound from "@/pages/NotFound/NotFound";
import AccountDeleteComplete from "@/pages/Setting/AccountDelete/AccountDeleteComplete";
import Start from "@/pages/Start/Start";

import RouteErrorBoundary from "./RouteErrorBoundary";

const Archive = lazy(() => import("@/pages/Archive/Archive"));
const Bookmarks = lazy(() => import("@/pages/Archive/Bookmarks/Bookmarks"));
const CalendarPage = lazy(
  () => import("@/pages/Archive/Calendar/CalendarPage")
);
const Likes = lazy(() => import("@/pages/Archive/Likes/Likes"));
const MyQuotes = lazy(() => import("@/pages/Archive/MyQuotes/MyQuotes"));
const CreateGroup = lazy(() => import("@/pages/CreateGroup/CreateGroup"));
const FriendGroup = lazy(() => import("@/pages/FriendGroup/FriendGroup"));
const FriendGroupAdd = lazy(
  () => import("@/pages/FriendGroup/pages/FriendGroupAdd")
);
const Group = lazy(() => import("@/pages/Group/Group"));
const ChangeMessage = lazy(
  () => import("@/pages/Group/pages/ChangeMessage/ChangeMessage")
);
const Invite = lazy(() => import("@/pages/Group/pages/Invite/Invite"));
const Login = lazy(() => import("@/pages/Login/Login"));
const EditQuoteTags = lazy(
  () => import("@/pages/Main/EditQuoteTags/EditQuoteTags")
);
const Home = lazy(() => import("@/pages/Main/Home"));
const Write = lazy(() => import("@/pages/Main/Write"));
const Notification = lazy(() => import("@/pages/Notification/Notification"));
const AccountDelete = lazy(
  () => import("@/pages/Setting/AccountDelete/AccountDelete")
);
const AccountSetting = lazy(
  () => import("@/pages/Setting/AccountSetting/AccountSetting")
);
const Notice = lazy(() => import("@/pages/Setting/Notice/Notice"));
const NotificationSetting = lazy(
  () => import("@/pages/Setting/NotificationSetting/NotificationSetting")
);
const ProfileCenter = lazy(
  () => import("@/pages/Setting-Profile/ProfileCenter/ProfileCenter")
);
const Profile = lazy(() => import("@/pages/SignUp/Profile/Profile"));

/**
 * 앱 전체 라우트
 */
export default function AppRoutes() {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* 인증 없이 접근 가능한 진입/인증 플로우 라우트 */}
          <Route path="/" element={<Start />} />
          <Route path="/profile" element={<Profile />} />
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route
            path="/account-delete-complete"
            element={<AccountDeleteComplete />}
          />

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
            <Route path="/account-setting" element={<AccountSetting />} />
            <Route path="/account-delete" element={<AccountDelete />} />
            <Route
              path="/notification-setting"
              element={<NotificationSetting />}
            />
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
      </Suspense>
    </RouteErrorBoundary>
  );
}

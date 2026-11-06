import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import Spinner from "@/components/Spinner/Spinner";
import { useMyProfileQuery } from "@/hooks/useProfileQueries";
import useAuthStore from "@/stores/useAuthStore";

/** 서버 확인 실패 시 세션을 종료하고 첫 화면으로 돌아간다. */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, logout } = useAuthStore();
  const profile = useMyProfileQuery(true);
  const verificationFailed = profile.isError ||
    (profile.isPending ? profile.fetchStatus === "paused" : !profile.data);

  useEffect(() => {
    if (!isLoading && isAuthenticated && verificationFailed) logout();
  }, [isAuthenticated, isLoading, logout, verificationFailed]);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated || verificationFailed) return <Navigate to="/" replace />;
  if (profile.isPending) return <Spinner />;
  return <Outlet />;
}

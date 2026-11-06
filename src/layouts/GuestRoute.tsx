import { Navigate, Outlet } from "react-router-dom";

import useAuthStore from "@/stores/useAuthStore";

export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/home" replace />;

  return <Outlet />;
}

import Spinner from "@/components/Spinner/Spinner";
import useAuthStore from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

/**
 * 인증이 필요한 보호된 경로 레이아웃
 * @returns 로딩 중엔 로딩 스피너 반환
 * @returns 비인증 상태면 시작 페이지로 리디렉션
 * @returns 인증 상태면 요청한 페이지 렌더링
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // 인증 상태를 확인하는 동안 (로딩 중)
  if (isLoading) {
    return <Spinner />;
  }

  // 로그인하지 않은 상태일 경우
  if (!isAuthenticated) {
    // 시작 페이지로 리디렉션
    return <Navigate to="/" replace />;
  }

  // 로그인한 상태일 경우, 요청한 페이지를 보여줌
  return <Outlet />;
}

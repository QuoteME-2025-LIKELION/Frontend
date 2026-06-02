import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("accessToken");

    if (token) {
      // 토큰 저장 + 로그인 상태 true
      login(token);

      // 회원가입 플로우
      navigate("/profile", { replace: true });
    } else {
      // 토큰 없으면 시작 화면
      navigate("/", { replace: true });
    }
  }, [navigate, searchParams, login]);

  return null;
}

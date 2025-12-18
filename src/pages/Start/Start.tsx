import Button from "@/components/Button/Button";
import * as S from "./StartStyled";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useState } from "react";
import useAuthStore from "@/stores/useAuthStore";
import useNotificationStore from "@/stores/useNotificationStore";

export default function Start() {
  const navigate = useNavigate();
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleGuestLogin = async () => {
    try {
      const res = await api.post("/api/auth/guest-login");
      if (res.status === 200 && res.data.data.accessToken) {
        const accessToken = res.data.data.accessToken;
        useAuthStore.getState().login(accessToken); // Zustand 스토어에 로그인 상태 업데이트
        useNotificationStore.getState().fetchNotifications(); // 알림 상태 초기화
        navigate("/home"); // 로그인 성공 후 이동할 경로
      }
    } catch (initialError) {
      console.error("1차 게스트 로그인 실패, 토큰 재발급 시도:", initialError);
      // 토큰 재발급 및 로그인 재시도
      try {
        // 토큰 재발급 요청
        await api.post("/api/auth/refresh");

        // 재발급 후 게스트 로그인 재시도
        const res = await api.post("/api/auth/guest-login");
        if (res.status === 200 && res.data.data.accessToken) {
          const accessToken = res.data.data.accessToken;
          useAuthStore.getState().login(accessToken); // Zustand 스토어에 로그인 상태 업데이트
          useNotificationStore.getState().fetchNotifications(); // 알림 상태 초기화
          navigate("/home"); // 로그인 성공 후 이동할 경로
        }
      } catch (retryError) {
        // 재발급 또는 재시도 실패 시 최종 에러 처리
        console.error("게스트 로그인 재시도 실패:", retryError);
        setShowErrorToast(true);
      }
    }
  };

  return (
    <S.Container>
      {showErrorToast && (
        <ToastModal
          isVisible={showErrorToast}
          onClose={() => setShowErrorToast(false)}
          text="게스트 로그인에 실패했습니다."
        />
      )}
      <S.TextBox>
        <S.TitleText>QuoteMe</S.TitleText>
        <S.Text>소소한 생각도 쿼트미로 소중하게 모아보세요.</S.Text>
      </S.TextBox>
      <S.BtnBox>
        <S.Button style={{ height: 43 }} onClick={handleGuestLogin}>
          게스트로 시작
        </S.Button>
        <Button title="회원가입" onClick={() => navigate("/signup")} />
        <Button title="로그인" onClick={() => navigate("/login")} />
      </S.BtnBox>
    </S.Container>
  );
}

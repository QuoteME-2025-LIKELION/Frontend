import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import * as S from "./SettingPageStyled";
import Header from "@/components/Header/Header";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
import useAuthStore from "@/stores/useAuthStore";
import api from "@/api/api";

export default function SettingPage() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      setShowLogoutModal(false);
      useAuthStore.getState().logout(); // Zustand 스토어에서 로그아웃 처리
      setShowLogoutToast(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("로그아웃 처리 중 오류:", err);
      setShowErrorToast(true);
      return;
    }
  };

  return (
    <>
      <PageTitle title="환경설정" />
      <S.Container>
        {showToast && (
          <ToastModal
            text="준비 중인 기능입니다."
            isVisible={showToast}
            onClose={() => setShowToast(false)}
          />
        )}
        {showLogoutModal && (
          <ConfirmModal
            question="로그아웃 하시겠습니까?"
            onClose={() => setShowLogoutModal(false)}
            onConfirm={handleConfirmLogout}
          />
        )}
        {showLogoutToast && (
          <ToastModal
            text="로그아웃 되었습니다."
            isVisible={showLogoutToast}
            onClose={() => setShowLogoutToast(false)}
          />
        )}
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => setShowErrorToast(false)}
            text="로그아웃에 실패했습니다."
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="환경설정"
          backgroundColor="white"
          onClickXBtn={() => navigate("/home")}
        />
        <S.SettingList>
          <S.SettingBtn
            onClick={() =>
              navigate("/profile-center", {
                state: { from: "/setting-page" }, // setting 페이지(환경설정에서 왔다고 표시)
              })
            }
          >
            프로필
          </S.SettingBtn>
          <S.SettingBtn onClick={() => navigate("/account-setting")}>
            계정
          </S.SettingBtn>
          <S.SettingBtn onClick={() => setShowToast(true)}>알림</S.SettingBtn>
          <S.SettingBtn
            style={{ borderBottom: "1px solid #DDD" }}
            onClick={() => setShowToast(true)}
          >
            공지사항
          </S.SettingBtn>
          <S.SettingWordLine>
            <S.SettingWord>버전</S.SettingWord>
            <S.SettingWord>1.0</S.SettingWord>
          </S.SettingWordLine>
          <S.LogOutBtn onClick={handleLogout}>로그아웃</S.LogOutBtn>
        </S.SettingList>
      </S.Container>
    </>
  );
}

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import * as S from "./SettingPage.styles";
import Header from "@/components/Header/Header";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/PageTitle/PageTitle";
import useAuthStore from "@/stores/useAuthStore";
import { useLogoutMutation } from "@/hooks/useAuthQueries";

type SettingToast = "comingSoon" | "logoutSuccess" | "logoutError" | null;

export default function SettingPage() {
  const navigate = useNavigate();
  const { mutateAsync: logout } = useLogoutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toastType, setToastType] = useState<SettingToast>(null);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      useAuthStore.getState().logout(); // Zustand 스토어에서 로그아웃 처리
      setToastType("logoutSuccess");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("로그아웃 처리 중 오류:", err);
      setShowLogoutModal(false);
      setToastType("logoutError");
      return;
    }
  };

  return (
    <>
      <PageTitle title="환경설정" />
      <S.Container>
        {toastType === "comingSoon" && (
          <ToastModal
            text="준비 중인 기능입니다."
            isVisible={true}
            onClose={() => setToastType(null)}
          />
        )}
        {showLogoutModal && (
          <ConfirmModal
            question="로그아웃 하시겠습니까?"
            onClose={() => setShowLogoutModal(false)}
            onConfirm={handleConfirmLogout}
          />
        )}
        {toastType === "logoutSuccess" && (
          <ToastModal
            text="로그아웃 되었습니다."
            isVisible={true}
            onClose={() => setToastType(null)}
          />
        )}
        {toastType === "logoutError" && (
          <ToastModal
            isVisible={true}
            onClose={() => setToastType(null)}
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
          <div>
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
            <S.SettingBtn onClick={() => setToastType("comingSoon")}>
              알림
            </S.SettingBtn>
            <S.SettingBtn
              style={{ borderBottom: "1px solid #DDD" }}
              onClick={() => setToastType("comingSoon")}
            >
              공지사항
            </S.SettingBtn>
          </div>
          <div>
            <S.SettingWordLine>
              <S.SettingWord>버전</S.SettingWord>
              <S.SettingWord>1.0</S.SettingWord>
            </S.SettingWordLine>
            <S.LogOutBtn onClick={handleLogout}>로그아웃</S.LogOutBtn>
          </div>
        </S.SettingList>
      </S.Container>
    </>
  );
}

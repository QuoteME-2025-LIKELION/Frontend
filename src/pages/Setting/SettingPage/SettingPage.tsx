import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import * as S from "./SettingPageStyled";
import Header from "@/components/Header/Header";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SettingPage() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  const handleLogout = () => {
    // 로그아웃 로직 추가
    setShowLogoutModal(false);
    setShowLogoutToast(true);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
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
          onConfirm={handleLogout}
        />
      )}
      {showLogoutToast && (
        <ToastModal
          text="로그아웃 되었습니다."
          isVisible={showLogoutToast}
          onClose={() => setShowLogoutToast(false)}
        />
      )}
      <Header
        showBackBtn={false}
        showXBtn={true}
        title="환경설정"
        backgroundColor="white"
        onClickXBtn={() => navigate(-1)}
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
        <S.LogOutBtn onClick={() => setShowLogoutModal(true)}>
          로그아웃
        </S.LogOutBtn>
      </S.SettingList>
    </S.Container>
  );
}

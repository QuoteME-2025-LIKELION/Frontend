import Header from "@/components/Header/Header";
import * as S from "./PagesStyle";
import { useNavigate } from "react-router-dom";
import GroupCard from "@/pages/FriendGroup/components/GroupCard";
import { useCallback, useState } from "react";
import ToastModal from "@/components/ToastModal/ToastModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";

export default function MyGroups() {
  const navigate = useNavigate();
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showQuitToast, setShowQuitToast] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(""); // 탈퇴할 그룹 이름 상태
  const handleQuitGroup = useCallback((groupName: string) => {
    setSelectedGroup(groupName);
    setShowQuitModal(true);
  }, []);

  const handleConfirmQuit = useCallback(() => {
    setShowQuitModal(false);
    setShowQuitToast(true);
  }, []);
  return (
    <S.Container>
      {showQuitModal && (
        <ConfirmModal
          nickname={selectedGroup}
          question="에서 탈퇴하시겠습니까?"
          onClose={() => setShowQuitModal(false)}
          onConfirm={handleConfirmQuit}
        />
      )}
      {showQuitToast && (
        <ToastModal
          text="그룹을 탈퇴하였습니다."
          isVisible={showQuitToast}
          onClose={() => setShowQuitToast(false)}
        />
      )}
      <Header
        showBackBtn={false}
        showXBtn={true}
        title="나의 그룹 관리"
        backgroundColor="white"
        onClickXBtn={() => navigate(-1)}
      />
      <S.Content>
        <GroupCard
          title="스어 친구들"
          memberCount={3}
          sinceYear={2025}
          onBtnClick={() => handleQuitGroup("스어 친구들")}
          isButton={true}
          onCardClick={() => navigate("/group")}
        />
      </S.Content>
    </S.Container>
  );
}

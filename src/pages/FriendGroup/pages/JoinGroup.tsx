import Header from "@/components/Header/Header";
import * as S from "./PagesStyle";
import { useNavigate } from "react-router-dom";
import GroupCard from "@/pages/FriendGroup/components/GroupCard";
import { useCallback, useState } from "react";
import ToastModal from "@/components/ToastModal/ToastModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";

export default function JoinGroup() {
  // TO-DO : useParams() 활용해 그룹 ID 받아온 뒤, 해당 그룹 정보 API로 조회해서 렌더링
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 그룹 참여 요청 전송 로직
  const handleConfirm = useCallback(() => {
    setShowModal(false);
    setShowToast(true);
  }, []);

  return (
    <S.Container>
      {showModal && (
        <ConfirmModal
          question="그룹 참여를 요청할까요?"
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          showOverlay={false}
        />
      )}
      {showToast && (
        <ToastModal
          text="그룹 참여를 요청했습니다."
          isVisible={showToast}
          onClose={() => setShowToast(false)}
          showOverlay={false}
        />
      )}
      <Header
        showBackBtn={true}
        showXBtn={false}
        title=""
        backgroundColor="white"
        onClickBackBtn={() => navigate(-1)}
      />
      <S.Content>
        <GroupCard
          title="스어 친구들"
          memberCount={3}
          sinceYear={2025}
          onBtnClick={() => setShowModal(true)}
        />
      </S.Content>
    </S.Container>
  );
}

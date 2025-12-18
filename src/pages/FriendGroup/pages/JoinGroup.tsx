import Header from "@/components/Header/Header";
import * as S from "./PagesStyle";
import { useNavigate, useParams } from "react-router-dom";
import GroupCard from "@/pages/FriendGroup/components/GroupCard";
import { useCallback, useEffect, useState } from "react";
import ToastModal from "@/components/ToastModal/ToastModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { Group } from "@/types/group.type";
import api from "@/api/api";
import type { AxiosError } from "axios";

export default function JoinGroup() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState<Group | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    // groupId 유효성 검사
    if (!groupId || isNaN(Number(groupId))) {
      navigate("/*", { replace: true });
      return;
    }

    const fetchGroupData = async () => {
      try {
        const res = await api.get(`/api/groups/${groupId}`);
        setGroupData(res.data);
      } catch (err: AxiosError | any) {
        console.error("그룹 데이터 불러오기 오류:", err);
        setGroupData(null);
        // 500 에러일 경우 NotFound 페이지로 이동
        if (err.response && err.response.status === 500) {
          navigate("/*", { replace: true });
        }
      }
    };

    fetchGroupData();
  }, [groupId, navigate]);

  // 그룹 참여 요청 전송 로직
  const handleConfirm = useCallback(async () => {
    if (groupData?.memberCount === 5) {
      setShowErrorToast(true);
      return;
    }
    try {
      await api.post(`/api/groups/${groupId}/join-request`);

      setShowModal(false);
      setShowToast(true);

      setTimeout(() => {
        navigate("/friend-group");
      }, 1500);
    } catch (err) {
      console.error("그룹 참여 요청 오류:", err);
    }
  }, [navigate, groupId]);

  return (
    <>
      {/* 페이지 타이틀 그룹명으로 하는 것도 가능할 수도 */}
      <PageTitle title="그룹 참여하기" />
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
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            text="그룹원이"
            redText="5인을 초과"
            text2="하여"
            text3="참여가 불가능합니다."
            showOverlay={false}
            onClose={() => setShowErrorToast(false)}
          />
        )}
        <Header
          showBackBtn={true}
          showXBtn={false}
          title=""
          backgroundColor="white"
          onClickBackBtn={() => navigate("/friend-group")}
        />
        <S.Content>
          <GroupCard group={groupData!} onBtnClick={() => setShowModal(true)} />
        </S.Content>
      </S.Container>
    </>
  );
}

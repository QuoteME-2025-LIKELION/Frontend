import Header from "@/components/Header/Header";
import * as S from "./Pages.styles";
import { useNavigate, useParams } from "react-router-dom";
import GroupCard from "../components/GroupCard";
import { useCallback, useEffect, useState } from "react";
import ToastModal from "@/components/ToastModal/ToastModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import axios from "axios";
import {
  useGroupQuery,
  useRequestJoinGroupMutation,
} from "@/hooks/useGroupQueries";

type JoinGroupToast = "success" | "full" | "error" | null;

export default function JoinGroup() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isValidGroupId = Boolean(groupId && !isNaN(Number(groupId)));
  const { data: groupData, error: groupError } = useGroupQuery(
    isValidGroupId ? groupId : undefined
  );
  const { mutateAsync: requestJoinGroup } = useRequestJoinGroupMutation();
  const [showModal, setShowModal] = useState(false);
  const [toastType, setToastType] = useState<JoinGroupToast>(null);

  useEffect(() => {
    // groupId 유효성 검사
    if (!isValidGroupId) {
      navigate("/not-found", { replace: true });
    }
  }, [isValidGroupId, navigate]);

  useEffect(() => {
    // 500 에러일 경우 NotFound 페이지로 이동
    if (axios.isAxiosError(groupError) && groupError.response?.status === 500) {
      navigate("/not-found", { replace: true });
    }
  }, [groupError, navigate]);

  // 그룹 참여 요청 전송 로직
  const handleConfirm = useCallback(async () => {
    if ((groupData?.memberCount ?? 0) >= 5) {
      setToastType("full");
      return;
    }
    try {
      await requestJoinGroup(groupId!);

      setShowModal(false);
      setToastType("success");
      setTimeout(() => {
        navigate("/friend-group");
      }, 1500);
    } catch (err) {
      console.error("그룹 참여 요청 오류:", err);
      setShowModal(false);
      setToastType("error");
    }
  }, [groupData?.memberCount, groupId, navigate, requestJoinGroup]);

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
        {toastType === "success" && (
          <ToastModal
            text="그룹 참여를 요청했습니다."
            isVisible={true}
            onClose={() => setToastType(null)}
            showOverlay={false}
          />
        )}
        {toastType === "full" && (
          <ToastModal
            isVisible={true}
            text="그룹원이"
            redText="5인을 초과"
            text2="하여"
            text3="참여가 불가능합니다."
            showOverlay={false}
            onClose={() => setToastType(null)}
          />
        )}
        {toastType === "error" && (
          <ToastModal
            isVisible={true}
            text="그룹 참여 요청에 실패했습니다."
            showOverlay={false}
            onClose={() => setToastType(null)}
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
          {groupData && (
            <GroupCard group={groupData} onBtnClick={() => setShowModal(true)} />
          )}
        </S.Content>
      </S.Container>
    </>
  );
}

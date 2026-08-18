import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import {
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
} from "@/hooks/useGroupQueries";
import { useMyProfileQuery } from "@/hooks/useProfileQueries";

import * as S from "./Pages.styles";
import GroupCard from "../components/GroupCard";

type GroupQuitTarget = {
  id: number;
  name: string;
};

export default function MyGroups() {
  const navigate = useNavigate();
  const { data: groupsData = [] } = useMyGroupsQuery();
  const { data: myProfile } = useMyProfileQuery();
  const { mutateAsync: removeGroupMember } = useRemoveGroupMemberMutation();
  const myId = myProfile?.id;

  const [quitTarget, setQuitTarget] = useState<GroupQuitTarget | null>(null);
  const [showQuitToast, setShowQuitToast] = useState(false);

  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleQuitGroup = useCallback((groupName: string, groupId: number) => {
    setQuitTarget({ id: groupId, name: groupName });
  }, []);

  const handleConfirmQuit = useCallback(async () => {
    if (!quitTarget) {
      console.error("탈퇴할 그룹 ID가 유효하지 않습니다.");
      setShowErrorToast(true);
      return;
    }

    try {
      if (myId == null) {
        throw new Error("사용자 ID를 가져올 수 없습니다.");
      }

      await removeGroupMember({
        groupId: quitTarget.id,
        memberId: myId,
      });

      setQuitTarget(null);
      setShowQuitToast(true);
    } catch (err) {
      console.error("그룹 탈퇴 처리 중 오류:", err);
      setQuitTarget(null);
      setShowErrorToast(true);
    }
  }, [myId, quitTarget, removeGroupMember]);
  return (
    <>
      <PageTitle title="나의 그룹 관리" />
      <S.Container>
        {quitTarget && (
          <ConfirmModal
            nickname={quitTarget.name}
            question="에서 탈퇴하시겠습니까?"
            onClose={() => setQuitTarget(null)}
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
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => setShowErrorToast(false)}
            text="그룹 탈퇴에 실패했습니다."
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="나의 그룹 관리"
          backgroundColor="white"
          onClickXBtn={() => navigate("/friend-group")}
        />
        <S.Content>
          {groupsData.length > 0 ? (
            groupsData.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onBtnClick={() => handleQuitGroup(group.name!, group.id)}
                isButton={true}
                onCardClick={() => navigate(`/group/${group.id}`)}
              />
            ))
          ) : (
            <S.EmptyBox>참여 중인 그룹이 없습니다.</S.EmptyBox>
          )}
        </S.Content>
      </S.Container>
    </>
  );
}

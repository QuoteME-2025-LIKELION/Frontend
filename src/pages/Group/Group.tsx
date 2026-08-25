import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import {
  useAcceptGroupJoinRequestMutation,
  useDeleteGroupMutation,
  useGroupJoinRequestsQuery,
  useGroupQuery,
  useRejectGroupJoinRequestMutation,
  useRemoveGroupMemberMutation,
} from "@/hooks/useGroupQueries";
import { useMyProfileQuery } from "@/hooks/useProfileQueries";

import GroupActionModals, {
  type GroupActionConfirm,
  type GroupMemberActionTarget,
} from "./components/GroupActionModals";
import GroupMainSection from "./components/GroupMainSection";
import GroupSummaryCard from "./components/GroupSummaryCard";
import * as S from "./Group.styles";

export default function Group() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isValidGroupId = Boolean(groupId && !isNaN(Number(groupId)));
  const { data: groupData, error: groupError } = useGroupQuery(
    isValidGroupId ? groupId : undefined
  );
  const { data: myProfile } = useMyProfileQuery();
  const myNickName = myProfile?.nickname || "";
  const isLeader = groupData?.leaderNickname === myNickName;
  const { data: joinRequests = [] } = useGroupJoinRequestsQuery(
    isLeader ? groupId : undefined
  );
  const { mutateAsync: removeGroupMember } = useRemoveGroupMemberMutation();
  const { mutateAsync: deleteGroup } = useDeleteGroupMutation();
  const { mutateAsync: acceptGroupJoinRequest } =
    useAcceptGroupJoinRequestMutation();
  const { mutateAsync: rejectGroupJoinRequest } =
    useRejectGroupJoinRequestMutation();

  const [deleteMemberTarget, setDeleteMemberTarget] =
    useState<GroupMemberActionTarget | null>(null);
  const [deletedMemberName, setDeletedMemberName] = useState("");
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const [groupActionConfirm, setGroupActionConfirm] =
    useState<GroupActionConfirm>(null);

  const [showFullGroupToast, setShowFullGroupToast] = useState(false);
  const [showJoinRequestToast, setShowJoinRequestToast] = useState(false);
  const [joinRequestToastMessage, setJoinRequestToastMessage] = useState("");
  const [pendingJoinRequestId, setPendingJoinRequestId] = useState<
    number | null
  >(null);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const members = useMemo(() => groupData?.members ?? [], [groupData?.members]);

  useEffect(() => {
    // groupId 유효성 검사
    if (!isValidGroupId) {
      navigate("/not-found", { replace: true });
    }
  }, [isValidGroupId, navigate]);

  useEffect(() => {
    if (
      axios.isAxiosError(groupError) &&
      [404, 500].includes(groupError.response?.status ?? 0)
    ) {
      navigate("/not-found", { replace: true });
    }
  }, [groupError, navigate]);

  const handleDeleteMember = useCallback((userName: string, userId: number) => {
    setDeleteMemberTarget({ id: userId, nickname: userName });
  }, []);
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteMemberTarget || !groupId) {
      console.error("삭제할 그룹원 또는 그룹 ID가 유효하지 않습니다.");
      return;
    }

    try {
      await removeGroupMember({ groupId, memberId: deleteMemberTarget.id });

      setDeletedMemberName(deleteMemberTarget.nickname);
      setDeleteMemberTarget(null);
      setShowDeleteToast(true);
    } catch (err) {
      console.error("그룹원 삭제 오류:", err);
      setDeleteMemberTarget(null);
      setErrorMessage("그룹원 삭제에 실패했습니다.");
      setShowErrorToast(true);
    }
  }, [deleteMemberTarget, groupId, removeGroupMember]);

  const handleAcceptJoinRequest = useCallback(
    async (requestId: number) => {
      if (!groupId) {
        console.error("그룹 ID가 유효하지 않습니다.");
        return;
      }

      if (pendingJoinRequestId !== null) {
        return;
      }

      if (members.length >= 5) {
        setShowFullGroupToast(true);
        return;
      }

      const targetRequest = joinRequests.find(
        (request) => request.requestId === requestId
      );

      setPendingJoinRequestId(requestId);

      try {
        await acceptGroupJoinRequest({ groupId, requestId });
        setJoinRequestToastMessage(
          targetRequest
            ? `${targetRequest.requesterNickname}님을 그룹에 추가했습니다.`
            : "가입 요청을 수락했습니다."
        );
        setShowJoinRequestToast(true);
      } catch (err) {
        console.error("그룹 가입 요청 수락 처리 중 오류:", err);
        setErrorMessage("그룹 가입 요청 수락에 실패했습니다.");
        setShowErrorToast(true);
      } finally {
        setPendingJoinRequestId(null);
      }
    },
    [
      acceptGroupJoinRequest,
      groupId,
      joinRequests,
      members.length,
      pendingJoinRequestId,
    ]
  );

  const handleRejectJoinRequest = useCallback(
    async (requestId: number) => {
      if (!groupId) {
        console.error("그룹 ID가 유효하지 않습니다.");
        return;
      }

      if (pendingJoinRequestId !== null) {
        return;
      }

      const targetRequest = joinRequests.find(
        (request) => request.requestId === requestId
      );

      setPendingJoinRequestId(requestId);

      try {
        await rejectGroupJoinRequest({ groupId, requestId });
        setJoinRequestToastMessage(
          targetRequest
            ? `${targetRequest.requesterNickname}님의 가입 요청을 거절했습니다.`
            : "가입 요청을 거절했습니다."
        );
        setShowJoinRequestToast(true);
      } catch (err) {
        console.error("그룹 가입 요청 거절 처리 중 오류:", err);
        setErrorMessage("그룹 가입 요청 거절에 실패했습니다.");
        setShowErrorToast(true);
      } finally {
        setPendingJoinRequestId(null);
      }
    },
    [groupId, joinRequests, pendingJoinRequestId, rejectGroupJoinRequest]
  );

  const handleQuitGroup = useCallback(() => {
    setGroupActionConfirm("quit");
  }, []);
  const handleConfirmQuit = useCallback(async () => {
    try {
      const myId = myProfile?.id;

      if (myId == null || !groupId) {
        throw new Error("사용자 ID를 가져올 수 없습니다.");
      }

      await removeGroupMember({ groupId, memberId: myId });

      setGroupActionConfirm(null);
      navigate("/friend-group", {
        state: { toastMessage: "그룹에서 탈퇴하였습니다." },
      });
    } catch (err) {
      console.error("그룹 탈퇴 처리 중 오류:", err);
      setGroupActionConfirm(null);
      setErrorMessage("그룹 탈퇴에 실패했습니다.");
      setShowErrorToast(true);
    }
  }, [groupId, myProfile?.id, navigate, removeGroupMember]);

  const handleDeleteGroup = useCallback(() => {
    setGroupActionConfirm("delete");
  }, []);
  const handleInviteGroup = useCallback(() => {
    if (members.length >= 5) {
      setShowFullGroupToast(true);
      return;
    }

    navigate(`/group/${groupId}/invite`);
  }, [groupId, members.length, navigate]);

  const handleConfirmDeleteGroup = useCallback(async () => {
    if (!groupId) {
      console.error("삭제할 그룹 ID가 유효하지 않습니다.");
      setGroupActionConfirm(null);
      return;
    }

    try {
      await deleteGroup(groupId);
      setGroupActionConfirm(null);
      navigate("/friend-group", {
        state: { toastMessage: "그룹이 해체되었습니다." },
      });
    } catch (err) {
      console.error("그룹 삭제 처리 중 오류:", err);
      setGroupActionConfirm(null);
      setErrorMessage("그룹 삭제에 실패했습니다.");
      setShowErrorToast(true);
    }
  }, [deleteGroup, groupId, navigate]);
  return (
    <>
      <PageTitle title={groupData?.name || "그룹 상세"} />
      <S.Container>
        <GroupActionModals
          deleteMemberTarget={deleteMemberTarget}
          deletedMemberName={deletedMemberName}
          groupActionConfirm={groupActionConfirm}
          showDeleteToast={showDeleteToast}
          showJoinRequestToast={showJoinRequestToast}
          joinRequestToastMessage={joinRequestToastMessage}
          showFullGroupToast={showFullGroupToast}
          showErrorToast={showErrorToast}
          errorMessage={errorMessage}
          onCloseDeleteMember={() => setDeleteMemberTarget(null)}
          onConfirmDeleteMember={handleConfirmDelete}
          onCloseGroupAction={() => setGroupActionConfirm(null)}
          onConfirmQuitGroup={handleConfirmQuit}
          onConfirmDeleteGroup={handleConfirmDeleteGroup}
          onCloseDeleteToast={() => setShowDeleteToast(false)}
          onCloseJoinRequestToast={() => setShowJoinRequestToast(false)}
          onCloseFullGroupToast={() => setShowFullGroupToast(false)}
          onCloseErrorToast={() => setShowErrorToast(false)}
        />
        <Header
          showBackBtn={true}
          showXBtn={false}
          title=""
          backgroundColor="primary"
          onClickBackBtn={() => navigate("/friend-group")}
        />
        <S.Content>
          <GroupSummaryCard group={groupData} />
          <GroupMainSection
            group={groupData}
            members={members}
            joinRequests={joinRequests}
            pendingJoinRequestId={pendingJoinRequestId}
            isLeader={isLeader}
            myMemberId={myProfile?.id}
            onEditMessage={() => navigate(`/group/${groupId}/change-message`)}
            onDeleteMember={handleDeleteMember}
            onAcceptJoinRequest={handleAcceptJoinRequest}
            onRejectJoinRequest={handleRejectJoinRequest}
            onInviteGroup={handleInviteGroup}
            onQuitGroup={handleQuitGroup}
            onDeleteGroup={handleDeleteGroup}
          />
        </S.Content>
      </S.Container>
    </>
  );
}

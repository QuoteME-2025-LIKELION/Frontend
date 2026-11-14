import axios from "axios";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { friendApi } from "@/api/friendApi";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useFriendsQuery } from "@/hooks/queries/useFriendQueries";
import {
  useCreateGroupMutation,
  useInviteGroupMemberMutation,
} from "@/hooks/queries/useGroupQueries";
import useDebounce from "@/hooks/ui/useDebounce";
import type { Friend } from "@/types/friend.type";
import { countCodePoints } from "@/utils/codePoint";

import CreateGroupInviteStep from "./components/CreateGroupInviteStep";
import CreateGroupStepFields from "./components/CreateGroupStepFields";
import CreateGroupToasts from "./components/CreateGroupToasts";
import * as S from "./CreateGroup.styles";

export default function CreateGroup() {
  const navigate = useNavigate();
  const { data: friends = [] } = useFriendsQuery();
  const { mutateAsync: createGroup, isPending: isCreatingGroup } =
    useCreateGroupMutation();
  const { mutateAsync: inviteGroupMember, isPending: isInvitingMember } =
    useInviteGroupMemberMutation();

  const [groupName, setGroupName] = useState("");
  const [motto, setMotto] = useState("");

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const [inviteTarget, setInviteTarget] = useState<Friend | null>(null);
  const [pendingInvites, setPendingInvites] = useState<Friend[]>([]);
  const [showInviteToast, setShowInviteToast] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState<number | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false); // 그룹 생성 시도 여부 상태

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage3, setErrorMessage3] = useState("");

  const friendList = useMemo(
    () =>
      friends.filter(
        (friend: Friend | null) => friend && friend.id && friend.nickname
      ),
    [friends]
  );

  const handleInviteFriend = useCallback((friend: Friend) => {
    setInviteTarget(friend);
  }, []);

  const handleConfirmInvite = useCallback(() => {
    if (!inviteTarget) {
      return;
    }

    if (pendingInvites.some((friend) => friend.id === inviteTarget.id)) {
      setInviteTarget(null);
      return;
    }

    if (pendingInvites.length >= 4) {
      setErrorMessage("친구는 최대 4명까지");
      setErrorMessage3("초대할 수 있습니다.");
      setShowErrorToast(true);
      setInviteTarget(null);
      return;
    }

    setPendingInvites((prev) => [...prev, inviteTarget]);
    setInviteTarget(null);
    setShowInviteToast(true);
  }, [inviteTarget, pendingInvites]);

  const handleCancelPendingInvite = useCallback((friendId: number) => {
    setPendingInvites((prev) => prev.filter((friend) => friend.id !== friendId));
  }, []);

  // 선택되지 않은 친구 목록 중 검색 키워드로 필터링
  const pendingInviteIds = useMemo(
    () => new Set(pendingInvites.map((friend) => friend.id)),
    [pendingInvites]
  );
  const filteredUnselectedFriends = friendList.filter(
    (friend) =>
      friend &&
      !pendingInviteIds.has(friend.id) &&
      friend.nickname.includes(debouncedKeyword)
  );

  const displayedFriends = filteredUnselectedFriends;
  const isSubmittingGroup = isCreatingGroup || isInvitingMember;

  const validateCreateGroup = useCallback(() => {
    setIsSubmitted(true); // 그룹 생성 버튼 클릭을 기록
    setErrorMessage3("");

    if (groupName.trim().length === 0) {
      setErrorMessage("그룹명을 입력해주세요.");
      setShowErrorToast(true);
      return false;
    }

    if (countCodePoints(groupName) > 10) {
      setErrorMessage("그룹명은 10자 이내로");
      setErrorMessage3("입력해 주세요.");
      setShowErrorToast(true);
      return false;
    }

    if (countCodePoints(motto) > 20) {
      setErrorMessage("메시지는 20자 이내로");
      setErrorMessage3("입력해 주세요.");
      setShowErrorToast(true);
      return false;
    }

    if (pendingInvites.length > 4) {
      setErrorMessage("친구는 최대 4명까지");
      setErrorMessage3("초대할 수 있습니다.");
      setShowErrorToast(true);
      return false;
    }

    return true;
  }, [groupName, motto, pendingInvites.length]);

  const handleRequestCreateGroup = useCallback(() => {
    if (isSubmittingGroup) {
      return;
    }

    if (!validateCreateGroup()) {
      return;
    }

    setShowCreateConfirm(true);
  }, [isSubmittingGroup, validateCreateGroup]);

  // 그룹 생성 로직
  const handleCreateGroup = useCallback(async () => {
    if (isSubmittingGroup) {
      return;
    }

    setShowCreateConfirm(false);

    try {
      const newGroupId =
        createdGroupId ??
        (
          await createGroup({
            name: groupName,
            motto: motto,
          })
        ).data.id;

      if (!newGroupId) {
        throw new Error("그룹 ID를 받아오지 못했습니다.");
      }

      setCreatedGroupId(newGroupId);

      if (pendingInvites.length > 0) {
        const invitationResults = await Promise.allSettled(
          pendingInvites.map((friend) =>
            inviteGroupMember({ groupId: newGroupId, friendId: friend.id })
          )
        );
        const failedInvites = pendingInvites.filter(
          (_, index) => invitationResults[index].status === "rejected"
        );

        if (failedInvites.length > 0) {
          setPendingInvites(failedInvites);
          setErrorMessage("일부 친구 초대에 실패했습니다.");
          setErrorMessage3("다시 시도해 주세요.");
          setShowErrorToast(true);
          return;
        }
      }

      navigate("/friend-group", {
        state: { toastMessage: "새로운 그룹이 만들어졌어요" },
      });
    } catch (err) {
      console.error("그룹 생성 또는 초대 오류:", err);
      const isDuplicateGroupName =
        createdGroupId === null &&
        axios.isAxiosError<{ resultCode?: string; message?: string }>(err) &&
        err.response?.status === 409 &&
        (err.response.data?.resultCode === "409-1" ||
          (err.response.data?.resultCode === "409" &&
            typeof err.response.data.message === "string" &&
            err.response.data.message.startsWith("409-1 - ")));
      setErrorMessage(
        isDuplicateGroupName
          ? "이미 사용 중인 그룹 이름입니다."
          : "그룹 생성 또는 친구 초대에"
      );
      setErrorMessage3(isDuplicateGroupName ? "" : "실패했습니다.");
      setShowErrorToast(true);
    }
  }, [
    createGroup,
    createdGroupId,
    groupName,
    inviteGroupMember,
    isSubmittingGroup,
    motto,
    navigate,
    pendingInvites,
  ]);

  const [step, setStep] = useState(1);
  const [isCheckingGroupName, setIsCheckingGroupName] = useState(false);
  const [groupNameError, setGroupNameError] = useState("");
  const groupNameCheckLock = useRef(false);

  const handleCheckGroupName = async () => {
    if (groupNameCheckLock.current) return;
    const name = groupName.trim();
    if (!name || countCodePoints(name) > 10) return;

    groupNameCheckLock.current = true;
    setIsCheckingGroupName(true);
    setGroupNameError("");
    try {
      const { data } = await friendApi.searchFriendsAndGroups(name);
      const isDuplicate = data.groups.some(
        (group) => group.name?.trim().toLowerCase() === name.toLowerCase()
      );
      if (isDuplicate) {
        setGroupNameError("이미 사용 중인 그룹 이름입니다.");
        return;
      }
      setGroupName(name);
      setStep(2);
    } catch {
      setGroupNameError("그룹 이름을 확인하지 못했어요. 다시 시도해 주세요.");
    } finally {
      groupNameCheckLock.current = false;
      setIsCheckingGroupName(false);
    }
  };

  return (
    <>
      <PageTitle title="그룹 만들기" />
      <S.Container>
        {inviteTarget && (
          <ConfirmModal
            question=""
            lines={[
              `${inviteTarget.nickname}님을 그룹에`,
              "초대하시겠어요?",
            ]}
            onClose={() => setInviteTarget(null)}
            onConfirm={handleConfirmInvite}
            showOverlay={true}
            cancelText="돌아가기"
            confirmText="초대하기"
            confirmColor="primary"
            variant="card"
          />
        )}
        {showCreateConfirm && (
          <ConfirmModal
            question=""
            lines={["이대로 그룹을 만들까요?"]}
            descriptionLines={[
              `그룹 이름: ${groupName.trim()}`,
              ...(motto.trim() ? [`메시지: ${motto.trim()}`] : []),
            ]}
            onClose={() => setShowCreateConfirm(false)}
            onConfirm={handleCreateGroup}
            showOverlay={true}
            cancelText="돌아가기"
            confirmText="만들기"
            confirmColor="primary"
            confirmDisabled={isSubmittingGroup}
            variant="card"
          />
        )}
        {showInviteToast && (
          <ToastModal
            text="초대할 멤버에 추가했습니다."
            isVisible={showInviteToast}
            onClose={() => setShowInviteToast(false)}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        <CreateGroupToasts
          showErrorToast={showErrorToast}
          errorMessage={errorMessage}
          errorMessage3={errorMessage3}
          onCloseErrorToast={() => {
            setShowErrorToast(false);
            setErrorMessage3("");
          }}
        />
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="그룹 만들기"
          backgroundColor="secondary"
          onClickXBtn={() => navigate("/friend-group")}
        />
        <S.Content>
          <CreateGroupStepFields
            step={step}
            groupName={groupName}
            motto={motto}
            isSubmitted={isSubmitted}
            isCheckingGroupName={isCheckingGroupName}
            groupNameError={groupNameError}
            onCheckGroupName={() => void handleCheckGroupName()}
            onChangeGroupName={(value) => {
              setGroupName(value);
              setGroupNameError("");
            }}
            onChangeMotto={setMotto}
            onMoveStep={setStep}
          />
          <CreateGroupInviteStep
            step={step}
            keyword={keyword}
            friendList={friendList}
            displayedFriends={displayedFriends}
            pendingInvites={pendingInvites}
            onChangeKeyword={setKeyword}
            onClearKeyword={() => setKeyword("")}
            onInviteFriend={handleInviteFriend}
            onCancelPendingInvite={handleCancelPendingInvite}
            onMoveStep={setStep}
            onMoveToFriendGroup={() => navigate("/friend-group/add")}
            onCreateGroup={handleRequestCreateGroup}
          />
        </S.Content>
      </S.Container>
    </>
  );
}

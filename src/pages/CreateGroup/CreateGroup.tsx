import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import useDebounce from "@/hooks/useDebounce";
import { useFriendsQuery } from "@/hooks/useFriendQueries";
import {
  useCreateGroupMutation,
  useInviteGroupMemberMutation,
} from "@/hooks/useGroupQueries";
import type { Friend } from "@/types/friend.type";

import CreateGroupInviteStep from "./components/CreateGroupInviteStep";
import CreateGroupStepFields from "./components/CreateGroupStepFields";
import CreateGroupToasts from "./components/CreateGroupToasts";
import * as S from "./CreateGroup.styles";

export default function CreateGroup() {
  const navigate = useNavigate();
  const { data: friends = [] } = useFriendsQuery();
  const { mutateAsync: createGroup } = useCreateGroupMutation();
  const { mutateAsync: inviteGroupMember } = useInviteGroupMemberMutation();

  const [groupName, setGroupName] = useState("");
  const [motto, setMotto] = useState("");

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const [inviteTarget, setInviteTarget] = useState<Friend | null>(null);
  const [pendingInvites, setPendingInvites] = useState<Friend[]>([]);
  const [showInviteToast, setShowInviteToast] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

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

  const validateCreateGroup = useCallback(() => {
    setIsSubmitted(true); // 그룹 생성 버튼 클릭을 기록
    setErrorMessage3("");

    if (groupName.trim().length === 0) {
      setErrorMessage("그룹명을 입력해주세요.");
      setShowErrorToast(true);
      return false;
    }

    if (groupName.length > 10) {
      setErrorMessage("그룹명은 10자 이내로");
      setErrorMessage3("입력해 주세요.");
      setShowErrorToast(true);
      return false;
    }

    if (motto.length > 20) {
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
    if (!validateCreateGroup()) {
      return;
    }

    setShowCreateConfirm(true);
  }, [validateCreateGroup]);

  // 그룹 생성 로직
  const handleCreateGroup = useCallback(async () => {
    setShowCreateConfirm(false);

    try {
      // 그룹 생성 API 호출하고 생성된 그룹 ID를 받음
      const createGroupRes = await createGroup({
        name: groupName,
        motto: motto,
      });
      const newGroupId = createGroupRes.data.id;

      if (!newGroupId) {
        throw new Error("그룹 ID를 받아오지 못했습니다.");
      }

      // 선택된 친구가 있으면 초대 API 호출
      if (pendingInvites.length > 0) {
        // 모든 초대를 병렬로 처리
        await Promise.all(
          pendingInvites.map((friend) =>
            inviteGroupMember({ groupId: newGroupId, friendId: friend.id })
          )
        );
      }

      navigate("/friend-group", {
        state: { toastMessage: "새로운 그룹을 만들었습니다" },
      });
    } catch (err) {
      console.error("그룹 생성 또는 초대 오류:", err);
      setErrorMessage("그룹 생성 또는 친구 초대에");
      setErrorMessage3("실패했습니다.");
      setShowErrorToast(true);
    }
  }, [
    createGroup,
    groupName,
    inviteGroupMember,
    motto,
    navigate,
    pendingInvites,
  ]);

  const [step, setStep] = useState(1);

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
              ...(motto.trim() ? [`메시지 : ${motto.trim()}`] : []),
            ]}
            onClose={() => setShowCreateConfirm(false)}
            onConfirm={handleCreateGroup}
            showOverlay={true}
            cancelText="돌아가기"
            confirmText="만들기"
            confirmColor="primary"
            variant="card"
          />
        )}
        {showInviteToast && (
          <ToastModal
            text="초대 요청을 보냈습니다"
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
            onChangeGroupName={setGroupName}
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

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header/Header";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import Search from "@/components/Search/Search";
import ToastModal from "@/components/ToastModal/ToastModal";
import useDebounce from "@/hooks/useDebounce";
import {
  useAcceptFriendRequestMutation,
  useFriendRequestsQuery,
  useFriendSearchQuery,
  useFriendsQuery,
  useRejectFriendRequestMutation,
  useRequestFriendMutation,
} from "@/hooks/useFriendQueries";
import {
  useAcceptGroupInvitationMutation,
  useGroupInvitationsQuery,
  useMyGroupsQuery,
  useRejectGroupInvitationMutation,
  useRequestJoinGroupMutation,
} from "@/hooks/useGroupQueries";
import type { Friend } from "@/types/friend.type";
import type { Group } from "@/types/group.type";

import FriendListSection from "../components/FriendListSection";
import FriendRequestSection from "../components/FriendRequestSection";
import GroupInvitationSection from "../components/GroupInvitationSection";
import GroupListSection from "../components/GroupListSection";
import * as S from "../FriendGroup.styles";

const isValidFriend = (data: unknown): data is Friend => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const friend = data as Partial<Friend>;
  return typeof friend.id === "number" && typeof friend.nickname === "string";
};

const isValidGroup = (data: unknown): data is Group => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const group = data as Partial<Group>;
  return typeof group.id === "number" && typeof group.name === "string";
};

export default function FriendGroupAdd() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce<string>(keyword, 500);
  const [pendingFriendRequestId, setPendingFriendRequestId] = useState<
    number | null
  >(null);
  const [pendingGroupInvitationId, setPendingGroupInvitationId] = useState<
    number | null
  >(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [friendRequestTarget, setFriendRequestTarget] = useState<Friend | null>(
    null
  );
  const [groupJoinTarget, setGroupJoinTarget] = useState<Group | null>(null);
  const [showFriendRequestToast, setShowFriendRequestToast] = useState(false);
  const [showGroupJoinRequestToast, setShowGroupJoinRequestToast] =
    useState(false);
  const [responseToastMessage, setResponseToastMessage] = useState("");

  const { data: groups = [] } = useMyGroupsQuery();
  const { data: friends = [] } = useFriendsQuery();
  const { data: friendRequests = [] } = useFriendRequestsQuery(!keyword);
  const { data: groupInvitations = [] } = useGroupInvitationsQuery(!keyword);
  const { data: searchResult } = useFriendSearchQuery(
    debouncedKeyword,
    Boolean(debouncedKeyword)
  );
  const { mutateAsync: requestFriend } = useRequestFriendMutation();
  const { mutateAsync: acceptFriendRequest } = useAcceptFriendRequestMutation();
  const { mutateAsync: rejectFriendRequest } = useRejectFriendRequestMutation();
  const { mutateAsync: acceptGroupInvitation } =
    useAcceptGroupInvitationMutation();
  const { mutateAsync: rejectGroupInvitation } =
    useRejectGroupInvitationMutation();
  const { mutateAsync: requestJoinGroup } = useRequestJoinGroupMutation();

  const groupsList = useMemo(() => groups.filter(isValidGroup), [groups]);
  const friendList = useMemo(() => friends.filter(isValidFriend), [friends]);
  const friendIdSet = useMemo(
    () => new Set(friendList.map((friend) => friend.id)),
    [friendList]
  );
  const myGroupIdSet = useMemo(
    () => new Set(groupsList.map((group) => group.id)),
    [groupsList]
  );
  const searchResultGroups = useMemo(
    () =>
      Array.isArray(searchResult?.groups)
        ? searchResult.groups.filter(isValidGroup)
        : [],
    [searchResult]
  );
  const searchResultMembers = useMemo(
    () =>
      Array.isArray(searchResult?.members)
        ? searchResult.members.filter(isValidFriend)
        : [],
    [searchResult]
  );

  const handleRequestFriend = useCallback(
    (nickname: string, userId: number) => {
      setFriendRequestTarget({ id: userId, nickname });
    },
    []
  );

  const handleConfirmFriendRequest = useCallback(async () => {
    if (!friendRequestTarget) {
      return;
    }

    try {
      await requestFriend(friendRequestTarget.id);
      setFriendRequestTarget(null);
      setShowFriendRequestToast(true);
    } catch (err) {
      console.error("친구 요청 처리 중 오류:", err);
      setFriendRequestTarget(null);
      setErrorMessage("친구 요청 전송에 실패했습니다.");
      setShowErrorToast(true);
    }
  }, [friendRequestTarget, requestFriend]);

  const handleOpenGroup = useCallback(
    (groupId: number) => {
      navigate(`/group/${groupId}`);
    },
    [navigate]
  );

  const handleJoinGroup = useCallback(
    (groupId: number) => {
      const target = searchResultGroups.find((group) => group.id === groupId);

      if (target) {
        setGroupJoinTarget(target);
      }
    },
    [searchResultGroups]
  );

  const handleConfirmGroupJoin = useCallback(async () => {
    if (!groupJoinTarget) {
      return;
    }

    try {
      await requestJoinGroup(groupJoinTarget.id);
      setGroupJoinTarget(null);
      setShowGroupJoinRequestToast(true);
    } catch (err) {
      console.error("그룹 참여 요청 처리 중 오류:", err);
      setGroupJoinTarget(null);
      setErrorMessage("그룹 참여 요청에 실패했습니다.");
      setShowErrorToast(true);
    }
  }, [groupJoinTarget, requestJoinGroup]);

  const handleAcceptFriendRequest = useCallback(
    async (requestId: number) => {
      setPendingFriendRequestId(requestId);

      try {
        await acceptFriendRequest(requestId);
        setResponseToastMessage("친구 신청을 승인했습니다");
      } catch (err) {
        console.error("친구 요청 수락 처리 중 오류:", err);
        setErrorMessage("친구 요청 수락에 실패했습니다.");
        setShowErrorToast(true);
      } finally {
        setPendingFriendRequestId(null);
      }
    },
    [acceptFriendRequest]
  );

  const handleRejectFriendRequest = useCallback(
    async (requestId: number) => {
      setPendingFriendRequestId(requestId);

      try {
        await rejectFriendRequest(requestId);
        setResponseToastMessage("친구 신청을 거절했습니다");
      } catch (err) {
        console.error("친구 요청 거절 처리 중 오류:", err);
        setErrorMessage("친구 요청 거절에 실패했습니다.");
        setShowErrorToast(true);
      } finally {
        setPendingFriendRequestId(null);
      }
    },
    [rejectFriendRequest]
  );

  const handleAcceptGroupInvitation = useCallback(
    async (requestId: number) => {
      setPendingGroupInvitationId(requestId);

      try {
        await acceptGroupInvitation(requestId);
        setResponseToastMessage("그룹 초대를 수락했습니다");
      } catch (err) {
        console.error("그룹 초대 수락 처리 중 오류:", err);
        setErrorMessage("그룹 초대 수락에 실패했습니다.");
        setShowErrorToast(true);
      } finally {
        setPendingGroupInvitationId(null);
      }
    },
    [acceptGroupInvitation]
  );

  const handleRejectGroupInvitation = useCallback(
    async (requestId: number) => {
      setPendingGroupInvitationId(requestId);

      try {
        await rejectGroupInvitation(requestId);
        setResponseToastMessage("그룹 초대를 거절했습니다");
      } catch (err) {
        console.error("그룹 초대 거절 처리 중 오류:", err);
        setErrorMessage("그룹 초대 거절에 실패했습니다.");
        setShowErrorToast(true);
      } finally {
        setPendingGroupInvitationId(null);
      }
    },
    [rejectGroupInvitation]
  );

  return (
    <>
      <PageTitle title="친구 및 그룹 추가" />
      <S.Container>
        {friendRequestTarget && (
          <ConfirmModal
            question=""
            lines={[
              `${friendRequestTarget.nickname}님에게 친구 신청을`,
              "보내시겠어요?",
            ]}
            onClose={() => setFriendRequestTarget(null)}
            onConfirm={handleConfirmFriendRequest}
            showOverlay={true}
            cancelText="돌아가기"
            confirmText="보내기"
            confirmColor="primary"
            variant="card"
          />
        )}
        {groupJoinTarget && (
          <ConfirmModal
            question=""
            lines={[
              `${groupJoinTarget.name} 그룹에`,
              "가입 요청을 보내시겠어요?",
            ]}
            onClose={() => setGroupJoinTarget(null)}
            onConfirm={handleConfirmGroupJoin}
            showOverlay={true}
            cancelText="돌아가기"
            confirmText="보내기"
            confirmColor="primary"
            variant="card"
          />
        )}
        {showFriendRequestToast && (
          <ToastModal
            text="친구 신청을 보냈습니다"
            isVisible={showFriendRequestToast}
            onClose={() => setShowFriendRequestToast(false)}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        {showGroupJoinRequestToast && (
          <ToastModal
            text="참여 요청을 보냈습니다"
            isVisible={showGroupJoinRequestToast}
            onClose={() => setShowGroupJoinRequestToast(false)}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        {responseToastMessage && (
          <ToastModal
            text={responseToastMessage}
            isVisible={Boolean(responseToastMessage)}
            onClose={() => setResponseToastMessage("")}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => setShowErrorToast(false)}
            text={errorMessage}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        <Header
          showBackBtn={true}
          showXBtn={false}
          title="친구 및 그룹 추가"
          backgroundColor="secondary"
          onClickBackBtn={() => navigate("/friend-group")}
        />
        <S.Content>
          <Search
            placeholder="검색어를 입력해 주세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword("")}
          />
          {keyword ? (
            <>
              <GroupListSection
                keyword={keyword}
                groups={[]}
                searchGroups={searchResultGroups}
                myGroupIdSet={myGroupIdSet}
                onCreateGroup={() => navigate("/create-group")}
                onOpenGroup={handleOpenGroup}
                onJoinGroup={handleJoinGroup}
                showManagementButtons={false}
              />
              <FriendListSection
                keyword={keyword}
                friends={[]}
                searchMembers={searchResultMembers}
                friendIdSet={friendIdSet}
                onDeleteFriend={() => undefined}
                onAddFriend={handleRequestFriend}
                hideExistingFriendAction
              />
            </>
          ) : (
            <>
              <S.AddGuideText>
                닉네임이나 그룹 이름을 검색하여
                <br />
                친구를 추가하거나 그룹에 가입해 보세요
              </S.AddGuideText>
              <FriendRequestSection
                requests={friendRequests}
                pendingRequestId={pendingFriendRequestId}
                onAccept={handleAcceptFriendRequest}
                onReject={handleRejectFriendRequest}
              />
              <GroupInvitationSection
                invitations={groupInvitations}
                pendingInvitationId={pendingGroupInvitationId}
                onAccept={handleAcceptGroupInvitation}
                onReject={handleRejectGroupInvitation}
              />
            </>
          )}
        </S.Content>
      </S.Container>
    </>
  );
}

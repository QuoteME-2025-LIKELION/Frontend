import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import Search from "@/components/Search/Search";
import useDebounce from "@/hooks/useDebounce";
import {
  useAddFriendMutation,
  useDeleteFriendMutation,
  useFriendSearchQuery,
  useFriendsQuery,
} from "@/hooks/useFriendQueries";
import { useMyGroupsQuery } from "@/hooks/useGroupQueries";
import type { Friend } from "@/types/friend.type";
import type { Group } from "@/types/group.type";

import FriendGroupListSection from "./components/FriendGroupListSection";
import FriendGroupModals, {
  type FriendActionTarget,
} from "./components/FriendGroupModals";
import FriendListSection from "./components/FriendListSection";
import * as S from "./FriendGroup.styles";

// 유효한 친구 객체인지 확인하는 타입 가드 함수
const isValidFriend = (data: unknown): data is Friend => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const friend = data as Partial<Friend>;
  return (
    typeof friend.id === "number" && typeof friend.nickname === "string"
  );
};

// 유효한 그룹 객체인지 확인하는 타입 가드 함수
const isValidGroup = (data: unknown): data is Group => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const group = data as Partial<Group>;
  return typeof group.id === "number" && typeof group.name === "string";
};

export default function FriendGroup() {
  // 검색 관련 상태
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce<string>(keyword, 500); // 디바운스된 키워드로 사용

  const [deleteTarget, setDeleteTarget] =
    useState<FriendActionTarget | null>(null);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const [addTarget, setAddTarget] = useState<FriendActionTarget | null>(null);
  const [showAddToast, setShowAddToast] = useState(false);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { data: friends = [] } = useFriendsQuery();
  const { data: groups = [] } = useMyGroupsQuery();
  const { data: searchResult } = useFriendSearchQuery(
    debouncedKeyword,
    Boolean(debouncedKeyword)
  );
  const { mutateAsync: deleteFriend } = useDeleteFriendMutation();
  const { mutateAsync: addFriend } = useAddFriendMutation();

  const friendList = useMemo(
    () => friends.filter(isValidFriend),
    [friends]
  );
  const groupsList = useMemo(() => groups.filter(isValidGroup), [groups]);
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

  // 현재 친구 ID 목록을 Set으로 만들어 빠른 조회
  const friendIdSet = useMemo(
    () => new Set(friendList.map((friend) => friend.id)),
    [friendList]
  );

  // 내가 속한 그룹 ID 목록을 Set으로 만들어 빠른 조회
  const myGroupIdSet = useMemo(
    () => new Set(groupsList.map((group) => group.id)),
    [groupsList]
  );

  const handleDeleteFriend = useCallback(
    (friendName: string, friendId: number) => {
      setDeleteTarget({ id: friendId, nickname: friendName });
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      console.error("삭제할 친구 ID가 유효하지 않습니다.");
      return;
    }
    try {
      await deleteFriend(deleteTarget.id);
      setDeleteTarget(null);
      setShowDeleteToast(true);
    } catch (err) {
      console.error("친구 삭제 처리 중 오류:", err);
      setDeleteTarget(null);
      setErrorMessage("친구 삭제에 실패했습니다.");
      setShowErrorToast(true);
    }
  }, [deleteFriend, deleteTarget]);

  const handleAddFriend = useCallback((userName: string, userId: number) => {
    setAddTarget({ id: userId, nickname: userName });
  }, []);

  const handleConfirmAdd = useCallback(async () => {
    if (!addTarget) {
      console.error("추가할 사용자 ID가 유효하지 않습니다.");
      return;
    }
    try {
      await addFriend(addTarget.id);

      setAddTarget(null);
      setShowAddToast(true);
    } catch (err) {
      console.error("친구 추가 처리 중 오류:", err);
      setAddTarget(null);
      setErrorMessage("친구 추가에 실패했습니다.");
      setShowErrorToast(true);
      return;
    }
  }, [addFriend, addTarget]);

  return (
    <>
      <PageTitle title="친구 및 그룹" />
      <S.Container>
        <FriendGroupModals
          deleteTarget={deleteTarget}
          addTarget={addTarget}
          showDeleteToast={showDeleteToast}
          showAddToast={showAddToast}
          showErrorToast={showErrorToast}
          errorMessage={errorMessage}
          onCloseDeleteModal={() => setDeleteTarget(null)}
          onConfirmDelete={handleConfirmDelete}
          onCloseAddModal={() => setAddTarget(null)}
          onConfirmAdd={handleConfirmAdd}
          onCloseDeleteToast={() => setShowDeleteToast(false)}
          onCloseAddToast={() => setShowAddToast(false)}
          onCloseErrorToast={() => setShowErrorToast(false)}
        />
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="친구 및 그룹"
          backgroundColor="secondary"
          onClickXBtn={() => navigate("/home")}
        />
        <S.Content>
          <Search
            placeholder="검색"
            desc="이메일, 닉네임, 그룹명으로 계정을 검색할 수 있어요."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => {
              setKeyword("");
            }}
          />
          <FriendGroupListSection
            keyword={keyword}
            groups={groupsList}
            searchGroups={searchResultGroups}
            myGroupIdSet={myGroupIdSet}
            onCreateGroup={() => navigate("/create-group")}
            onManageGroups={() => navigate("/my-groups")}
            onOpenGroup={(groupId) => navigate(`/group/${groupId}`)}
            onJoinGroup={(groupId) => navigate(`/join-group/${groupId}`)}
          />
          <FriendListSection
            keyword={keyword}
            friends={friendList}
            searchMembers={searchResultMembers}
            friendIdSet={friendIdSet}
            onDeleteFriend={handleDeleteFriend}
            onAddFriend={handleAddFriend}
          />
        </S.Content>
      </S.Container>
    </>
  );
}

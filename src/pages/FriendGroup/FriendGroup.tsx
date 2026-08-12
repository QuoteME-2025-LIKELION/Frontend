import Header from "@/components/Header/Header";
import * as S from "./FriendGroup.styles";
import { useNavigate } from "react-router-dom";
import Search from "@/components/Search/Search";
import UserListItem from "@/components/UserListItem/UserListItem";
import { useCallback, useMemo, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import useDebounce from "@/hooks/useDebounce";
import type { Friend } from "@/types/friend.type";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { Group } from "@/types/group.type";
import {
  useAddFriendMutation,
  useDeleteFriendMutation,
  useFriendSearchQuery,
  useFriendsQuery,
} from "@/hooks/useFriendQueries";
import { useMyGroupsQuery } from "@/hooks/useGroupQueries";

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

type FriendActionTarget = {
  id: number;
  nickname: string;
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
        {deleteTarget && (
          <ConfirmModal
            nickname={deleteTarget.nickname}
            question="님을 삭제하시겠습니까?"
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
            showOverlay={true}
          />
        )}
        {showDeleteToast && (
          <ToastModal
            text="친구가 삭제되었습니다."
            isVisible={showDeleteToast}
            onClose={() => setShowDeleteToast(false)}
          />
        )}
        {addTarget && (
          <ConfirmModal
            nickname={addTarget.nickname}
            question="님을 추가할까요?"
            onClose={() => setAddTarget(null)}
            onConfirm={handleConfirmAdd}
            showOverlay={true}
          />
        )}
        {showAddToast && (
          <ToastModal
            text="친구가 추가되었습니다."
            isVisible={showAddToast}
            onClose={() => setShowAddToast(false)}
          />
        )}
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => setShowErrorToast(false)}
            text={errorMessage}
          />
        )}
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
          <S.Section>
            <S.Title>
              <div>{keyword ? "그룹" : "나의 그룹"}</div>
              <S.BtnBox>
                <button onClick={() => navigate("/create-group")}>
                  그룹 만들기
                </button>
                <button onClick={() => navigate("/my-groups")}>관리</button>
              </S.BtnBox>
            </S.Title>
            <S.GroupContainer>
              {keyword ? (
                searchResultGroups.length > 0 ? (
                  searchResultGroups.map((group) => {
                    if (!group || !group.id) return null;
                    const isMyGroup = myGroupIdSet.has(group.id);
                    const path = isMyGroup
                      ? `/group/${group.id}`
                      : `/join-group/${group.id}`;
                    return (
                      <S.GroupBox key={group.id} onClick={() => navigate(path)}>
                        <S.GroupName>{group.name}</S.GroupName>
                        <S.GroupCount>{group.memberCount}</S.GroupCount>
                      </S.GroupBox>
                    );
                  })
                ) : (
                  <S.EmptyBox>검색 결과가 없습니다.</S.EmptyBox>
                )
              ) : groupsList.length > 0 ? (
                groupsList.map((group) => (
                  <S.GroupBox
                    key={group.id}
                    onClick={() => navigate(`/group/${group.id}`)}
                  >
                    <S.GroupName>{group.name}</S.GroupName>
                    <S.GroupCount>{group.memberCount}</S.GroupCount>
                  </S.GroupBox>
                ))
              ) : (
                <S.EmptyBox>가입한 그룹이 없습니다.</S.EmptyBox>
              )}
            </S.GroupContainer>
          </S.Section>
          <S.Section>
            {!keyword ? <S.Title>친구</S.Title> : <S.Title>유저</S.Title>}
            <S.FriendList>
              {keyword ? (
                searchResultMembers.length > 0 ? (
                  searchResultMembers.map((user) => {
                    if (!user || !user.id) return null;
                    const isFriend = friendIdSet.has(user.id);
                    return (
                      <UserListItem
                        key={user.id}
                        friend={user}
                        actionButton={
                          isFriend
                            ? {
                                type: "delete",
                                text: "삭제",
                                onClick: () =>
                                  handleDeleteFriend(user.nickname, user.id),
                              }
                            : {
                                type: "add",
                                text: "추가",
                                onClick: () =>
                                  handleAddFriend(user.nickname, user.id),
                              }
                        }
                      />
                    );
                  })
                ) : (
                  <S.EmptyBox>검색 결과가 없습니다.</S.EmptyBox>
                )
              ) : friendList.length > 0 ? (
                friendList.map((friend) => (
                  <UserListItem
                    key={friend.id}
                    friend={friend}
                    actionButton={{
                      type: "delete",
                      text: "삭제",
                      onClick: () =>
                        handleDeleteFriend(friend.nickname, friend.id),
                    }}
                  />
                ))
              ) : (
                <S.EmptyBox>명언을 나눌 친구가 없습니다.</S.EmptyBox>
              )}
            </S.FriendList>
          </S.Section>
        </S.Content>
      </S.Container>
    </>
  );
}

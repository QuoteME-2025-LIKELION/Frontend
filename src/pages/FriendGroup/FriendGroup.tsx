import Header from "@/components/Header/Header";
import * as S from "./FriendGroupStyle";
import { useNavigate } from "react-router-dom";
import Search from "@/components/Search/Search";
import List from "@/components/List/List";
import { useCallback, useEffect, useMemo, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import useDebounce from "@/hooks/useDebounce";
import api from "@/api/api";
import type { Friend } from "@/types/friend.type";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { Group } from "@/types/group.type";

export default function FriendGroup() {
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [groupsList, setGroupsList] = useState<Group[]>([]);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce<string>(keyword, 500); // 디바운스된 키워드로 사용
  const [searchResultGroups, setSearchResultGroups] = useState<Group[]>([]);
  const [searchResultMembers, setSearchResultMembers] = useState<Friend[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(""); // 삭제할 친구 이름 상태
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null); // 삭제할 친구 ID 상태

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddToast, setShowAddToast] = useState(false);
  const [selectedUser, setSelectedUser] = useState(""); // 추가할 친구 이름 상태
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // 추가할 친구 ID 상태

  const navigate = useNavigate();

  // 현재 친구 ID 목록을 Set으로 만들어 빠른 조회
  const friendIdSet = useMemo(
    () => new Set(friendList.map((friend) => friend.id)),
    [friendList]
  );

  // 친구 및 그룹 목록 초기 불러오기
  useEffect(() => {
    const fetchFriendsAndGroups = async () => {
      try {
        const friendsRes = await api.get("/api/settings/friends-list");
        setFriendList(friendsRes.data);
        const groupsRes = await api.get("/api/groups/me");
        setGroupsList(groupsRes.data);
      } catch (err) {
        console.error("친구 및 그룹 목록 불러오기 오류:", err);
        setFriendList([]);
        setGroupsList([]);
      }
    };
    fetchFriendsAndGroups();
  }, []);

  // 검색어가 변경될 때마다 디바운스된 키워드로 검색 실행
  useEffect(() => {
    if (debouncedKeyword) {
      // 검색어가 있을 때 실행할 로직
      const fetchResults = async () => {
        try {
          const res = await api.get(
            `/api/settings/search?keyword=${debouncedKeyword}`
          );
          setSearchResultGroups(res.data.groups);
          setSearchResultMembers(res.data.members);
        } catch (error) {
          console.error("검색 오류:", error);
          setSearchResultGroups([]);
          setSearchResultMembers([]);
        }
      };
      fetchResults();
    } else {
      setSearchResultGroups([]); // 검색어가 없을 때는 결과 초기화
      setSearchResultMembers([]);
    }
  }, [debouncedKeyword]);

  const handleDeleteFriend = useCallback(
    (friendName: string, friendId: number) => {
      setSelectedFriend(friendName);
      setSelectedFriendId(friendId);
      setShowDeleteModal(true);
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    // 친구 삭제 API 구현 후 추가
    setShowDeleteModal(false);
    setShowDeleteToast(true);
  }, []);

  const handleAddFriend = useCallback((userName: string, userId: number) => {
    setSelectedUser(userName);
    setSelectedUserId(userId);
    setShowAddModal(true);
  }, []);

  const handleConfirmAdd = useCallback(async () => {
    try {
      await api.post(`/api/friends/add/${selectedUserId}`);

      setShowAddModal(false);
      setShowAddToast(true);
    } catch (err) {
      console.error("친구 추가 처리 중 오류:", err);
      alert("친구 추가에 실패했습니다.");
      return;
    }
  }, [selectedUserId]);

  return (
    <>
      <PageTitle title="친구 및 그룹" />
      <S.Container>
        {showDeleteModal && (
          <ConfirmModal
            nickname={selectedFriend}
            question="님을 삭제하시겠습니까?"
            onClose={() => setShowDeleteModal(false)}
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
        {showAddModal && (
          <ConfirmModal
            nickname={selectedUser}
            question="님을 추가할까요?"
            onClose={() => setShowAddModal(false)}
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
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="친구 및 그룹"
          backgroundColor="white"
          onClickXBtn={() => navigate(-1)}
        />
        <S.Content>
          <Search
            placeholder="검색"
            desc="이메일, 닉네임, 그룹명으로 계정을 검색할 수 있어요."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword("")}
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
              {keyword
                ? searchResultGroups.map((group) => (
                    <S.GroupBox
                      key={group.id}
                      onClick={() => navigate(`/group/${group.id}`)}
                    >
                      <S.GroupName>{group.name}</S.GroupName>
                      <S.GroupCount>{group.memberCount}</S.GroupCount>
                    </S.GroupBox>
                  ))
                : groupsList.length > 0 &&
                  groupsList.map((group) => (
                    <S.GroupBox
                      key={group.id}
                      onClick={() => navigate(`/group/${group.id}`)}
                    >
                      <S.GroupName>{group.name}</S.GroupName>
                      <S.GroupCount>{group.memberCount}</S.GroupCount>
                    </S.GroupBox>
                  ))}
            </S.GroupContainer>
          </S.Section>
          <S.Section>
            {!keyword && <S.Title>친구</S.Title>}
            <S.FriendList>
              {keyword
                ? searchResultMembers.length > 0
                  ? searchResultMembers.map((user) => {
                      const isFriend = friendIdSet.has(user.id);
                      return (
                        <List
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
                  : null
                : friendList.map((friend) => (
                    <List
                      key={friend.id}
                      friend={friend}
                      actionButton={{
                        type: "delete",
                        text: "삭제",
                        onClick: () =>
                          handleDeleteFriend(friend.nickname, friend.id),
                      }}
                    />
                  ))}
            </S.FriendList>
          </S.Section>
        </S.Content>
      </S.Container>
    </>
  );
}

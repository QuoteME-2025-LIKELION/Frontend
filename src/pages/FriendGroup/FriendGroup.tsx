import Header from "@/components/Header/Header";
import * as S from "./FriendGroupStyle";
import { useNavigate } from "react-router-dom";
import Search from "@/components/Search/Search";
import List from "@/components/List/List";
import { useCallback, useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import useDebounce from "@/hooks/useDebounce";
import api from "@/api/api";
import type { Friend } from "@/types/friend.type";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function FriendGroup() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500); // 디바운스된 키워드로 사용
  const [searchResults, setSearchResults] = useState<Friend[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(""); // 삭제할 친구 이름 상태

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddToast, setShowAddToast] = useState(false);
  const [selectedUser, setSelectedUser] = useState(""); // 추가할 친구 이름 상태

  const navigate = useNavigate();

  // TO-DO : 그룹 검색도 추가
  // useEffect(() => {
  //   if (debouncedKeyword) {
  //     // 검색어가 있을 때 실행할 로직
  //     const fetchResults = async () => {
  //       try {
  //         const res = await api.get<Friend[]>(
  //           `/api/settings/search?keyword=${debouncedKeyword}`
  //         );
  //         setSearchResults(res.data);
  //       } catch (error) {
  //         console.error("검색 오류:", error);
  //         setSearchResults([]);
  //       }
  //     };
  //     fetchResults();
  //   } else {
  //     setSearchResults([]); // 검색어가 없을 때는 결과 초기화
  //   }
  // }, [debouncedKeyword]);

  const handleDeleteFriend = useCallback((friendName: string) => {
    setSelectedFriend(friendName);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setShowDeleteModal(false);
    setShowDeleteToast(true);
  }, []);

  const handleAddFriend = useCallback((userName: string) => {
    setSelectedUser(userName);
    setShowAddModal(true);
  }, []);

  const handleConfirmAdd = useCallback(() => {
    setShowAddModal(false);
    setShowAddToast(true);
  }, []);

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
              {keyword ? (
                <S.GroupBox onClick={() => navigate("/join-group")}>
                  {/* 검색 결과 나온 그룹 리스트 => join-group url 바뀌면 같이 수정 */}
                  <S.GroupName>스어 친구들</S.GroupName>
                  <S.GroupCount>2</S.GroupCount>
                </S.GroupBox>
              ) : (
                <>
                  <S.GroupBox onClick={() => navigate("/group")}>
                    {/* 가입한 그룹 배열 받아서 매핑 */}
                    <S.GroupName>무니니</S.GroupName>
                    <S.GroupCount>3</S.GroupCount>
                  </S.GroupBox>
                  <S.GroupBox onClick={() => navigate("/group")}>
                    {/* 가입한 그룹 배열 받아서 매핑 */}
                    <S.GroupName>무니니</S.GroupName>
                    <S.GroupCount>3</S.GroupCount>
                  </S.GroupBox>
                </>
              )}
            </S.GroupContainer>
          </S.Section>
          <S.Section>
            {!keyword && <S.Title>친구</S.Title>}
            <S.FriendList>
              {keyword ? (
                searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <List
                      key={user.id}
                      profileImgUrl={user.profileImage}
                      username={user.nickname}
                      intro={user.email}
                      actionButton={{
                        type: "add",
                        text: "추가",
                        onClick: () => handleAddFriend(user.nickname),
                      }}
                    />
                  ))
                ) : null
              ) : (
                <List
                  profileImgUrl="https://avatars.githubusercontent.com/u/189887138?v=4"
                  username="듀랄라"
                  intro="Positive Thinking"
                  actionButton={{
                    type: "delete",
                    text: "삭제",
                    onClick: () => handleDeleteFriend("듀랄라"),
                  }}
                />
              )}
            </S.FriendList>
          </S.Section>
        </S.Content>
      </S.Container>
    </>
  );
}

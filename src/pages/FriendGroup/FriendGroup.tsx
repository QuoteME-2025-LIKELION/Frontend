import Header from "@/components/Header/Header";
import * as S from "./FriendGroupStyle";
import { useNavigate } from "react-router-dom";
import Search from "@/components/Search/Search";
import List from "@/components/List/List";
import { useCallback, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";

export default function FriendGroup() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(""); // 삭제할 친구 이름 상태

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddToast, setShowAddToast] = useState(false);
  const [selectedUser, setSelectedUser] = useState(""); // 추가할 친구 이름 상태

  // TO-DO : Search 컴포넌트 값 state로 만든 뒤, 값 있는 경우엔 유저 정보 말고 검색어로 조회한 결과로 렌더링
  // 이때 조건부 렌더링 삼항연산자 활용

  const navigate = useNavigate();

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
        />
        <S.Section>
          <S.Title>
            <div>나의 그룹</div>
            <S.BtnBox>
              <button onClick={() => navigate("/create-group")}>
                그룹 만들기
              </button>
              <button onClick={() => navigate("/my-groups")}>관리</button>
            </S.BtnBox>
          </S.Title>
          <S.GroupContainer>
            {/* 가입한 그룹 배열 받아서 매핑 */}
            <S.GroupBox onClick={() => navigate("/group")}>
              <S.GroupName>무니니</S.GroupName>
              <S.GroupCount>3</S.GroupCount>
            </S.GroupBox>
            {/* 검색 결과 나온 그룹 리스트 => join-group url 바뀌면 같이 수정 */}
            <S.GroupBox onClick={() => navigate("/join-group")}>
              <S.GroupName>스어 친구들</S.GroupName>
              <S.GroupCount>2</S.GroupCount>
            </S.GroupBox>
          </S.GroupContainer>
        </S.Section>
        <S.Section>
          <S.Title>친구</S.Title>
          <S.FriendList>
            {/* 친구 리스트 배열 받아서 매핑 */}
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
            {/* 검색 결과 나온 유저 리스트 */}
            <List
              profileImgUrl="https://avatars.githubusercontent.com/u/189887138?v=4"
              username="어푸"
              intro="작심삼일의 권위자"
              actionButton={{
                type: "add",
                text: "추가",
                onClick: () => handleAddFriend("어푸"),
              }}
            />
            <List
              profileImgUrl="https://avatars.githubusercontent.com/u/189887138?v=4"
              username="어푸"
              intro="작심삼일의 권위자"
              actionButton={{
                type: "add",
                text: "추가",
                onClick: () => handleAddFriend("어푸"),
              }}
            />
            <List
              profileImgUrl="https://avatars.githubusercontent.com/u/189887138?v=4"
              username="어푸"
              intro="작심삼일의 권위자"
              actionButton={{
                type: "add",
                text: "추가",
                onClick: () => handleAddFriend("어푸"),
              }}
            />
            <List
              profileImgUrl="https://avatars.githubusercontent.com/u/189887138?v=4"
              username="어푸"
              intro="작심삼일의 권위자"
              actionButton={{
                type: "add",
                text: "추가",
                onClick: () => handleAddFriend("어푸"),
              }}
            />
          </S.FriendList>
        </S.Section>
      </S.Content>
    </S.Container>
  );
}

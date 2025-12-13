import Header from "@/components/Header/Header";
import * as S from "./CreateGroupStyle";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Search from "@/components/Search/Search";
import { useState } from "react";
import List from "@/components/List/List";
import ToastModal from "@/components/ToastModal/ToastModal";
import PageTitle from "@/components/PageTitle/PageTitle";

// 나중에 API로 받아올 친구 목록 데이터
const MOCK_FRIENDS = [
  {
    id: 1,
    profileImgUrl: "https://avatars.githubusercontent.com/u/189887138?v=4",
    username: "듀듀",
    intro: "Seize the day",
  },
  {
    id: 2,
    profileImgUrl: "https://avatars.githubusercontent.com/u/189887138?v=4",
    username: "듀가나다",
    intro: "due..",
  },
  {
    id: 3,
    profileImgUrl: "https://avatars.githubusercontent.com/u/189887138?v=4",
    username: "공룡",
    intro: "아리가또",
  },
  {
    id: 4,
    profileImgUrl: "https://avatars.githubusercontent.com/u/189887138?v=4",
    username: "듀랄라",
    intro: "due..!",
  },
  {
    id: 5,
    profileImgUrl: "https://avatars.githubusercontent.com/u/189887138?v=4",
    username: "옹",
    intro: "onggg..",
  },
  {
    id: 6,
    profileImgUrl: "https://avatars.githubusercontent.com/u/189887138?v=4",
    username: "신형철",
    intro: "hi",
  },
];

export default function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // 그룹 생성 시도 여부 상태

  // 친구 선택/해제 핸들러
  const handleSelectFriend = (id: number) => {
    setSelectedFriends((prev) => {
      if (prev.includes(id)) {
        // 이미 선택된 경우 선택 해제
        return prev.filter((friendId) => friendId !== id);
      } else {
        // 새로 선택하는 경우 5명 미만일 때만 추가
        if (prev.length < 5) {
          return [...prev, id];
        }
        return prev;
      }
    });
  };

  // 선택된 친구 객체 목록 (검색해도 항상 상단에 고정)
  const selectedFriendObjects = MOCK_FRIENDS.filter((friend) =>
    selectedFriends.includes(friend.id)
  );

  // 선택되지 않은 친구 목록 중 검색 키워드로 필터링
  const filteredUnselectedFriends = MOCK_FRIENDS.filter(
    (friend) =>
      !selectedFriends.includes(friend.id) && friend.username.includes(keyword)
  );

  // 위 목록을 합쳐서 최종적으로 표시할 친구 목록 생성
  const displayedFriends = [
    ...selectedFriendObjects,
    ...filteredUnselectedFriends,
  ];

  // 친구 목록 없을 때 테스트용
  // const displayedFriends = [];

  // 그룹 생성 로직
  const handleCreateGroup = () => {
    setIsSubmitted(true); // 그룹 생성 버튼 클릭을 기록

    if (groupName.trim().length === 0) {
      return; // 그룹명이 없으면 여기서 중단
    }

    // 그룹명이 있으면 토스트를 보여주고 페이지 이동
    setShowToast(true);
    setTimeout(() => {
      navigate("/group");
    }, 1500);
  };

  return (
    <>
      <PageTitle title="그룹 만들기" />
      <S.Container>
        {showToast && (
          <ToastModal
            isVisible={showToast}
            text="그룹이 생성되었습니다."
            onClose={() => setShowToast(false)}
            showOverlay={false}
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="그룹 만들기"
          backgroundColor="primary"
          onClickXBtn={() => navigate(-1)}
        />
        <S.Content>
          <S.NavyBox>
            {/* navy box */}
            <S.InputContainer>
              <S.InputBox>
                <Input
                  placeholder="그룹명 설정"
                  required={true}
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                {isSubmitted && groupName.trim().length === 0 ? (
                  <S.ErrorMsg>그룹명을 입력해주세요.</S.ErrorMsg>
                ) : (
                  <div>10자 내외</div>
                )}
              </S.InputBox>
              <S.InputBox>
                <Input
                  placeholder="메시지 설정"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div>20자 내외</div>
              </S.InputBox>
            </S.InputContainer>
          </S.NavyBox>
          <S.Main>
            <S.TitleContainer>
              <S.TitleLine>
                <S.Title>친구 초대하기</S.Title>
                <S.InviteCount>{selectedFriends.length}/5</S.InviteCount>
              </S.TitleLine>
              <S.Desc>그룹의 최대 인원은 5명입니다.</S.Desc>
            </S.TitleContainer>
            <Search
              placeholder="검색"
              desc={
                displayedFriends.length === 0
                  ? "아직 추가된 친구가 없습니다."
                  : "나의 친구 중에서만 초대할 수 있어요."
              }
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onClear={() => setKeyword("")}
            />
            <S.FriendListContainer>
              <S.FriendList>
                {displayedFriends.length > 0 ? (
                  displayedFriends.map((friend) => (
                    <List
                      key={friend.id}
                      profileImgUrl={friend.profileImgUrl}
                      username={friend.username}
                      intro={friend.intro}
                      isSelectable={true}
                      isSelected={selectedFriends.includes(friend.id)}
                      onSelect={() => handleSelectFriend(friend.id)}
                    />
                  ))
                ) : (
                  <S.EmptyFriendContainer>
                    <S.EmptyFriendList>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4.66669 4.6665L11.3334 11.3332M11.3334 11.3332V4.6665M11.3334 11.3332H4.66669"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <button onClick={() => navigate("/friend-group")}>
                        친구 추가
                      </button>
                      <div>탭으로 이동</div>
                    </S.EmptyFriendList>
                    {/* 만들어진 그룹 페이지로 이동 (url 수정 필요) */}
                    <Button title="그룹 만들기" onClick={handleCreateGroup} />
                  </S.EmptyFriendContainer>
                )}
              </S.FriendList>
            </S.FriendListContainer>
          </S.Main>
        </S.Content>
        {displayedFriends.length > 0 && (
          <S.BtnBox>
            {/* 만들어진 그룹 페이지로 이동 (url 수정 필요) */}
            <Button title="그룹 만들기" onClick={handleCreateGroup} />
          </S.BtnBox>
        )}
      </S.Container>
    </>
  );
}

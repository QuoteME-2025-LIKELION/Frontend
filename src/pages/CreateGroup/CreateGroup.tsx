import Header from "@/components/Header/Header";
import * as S from "./CreateGroupStyle";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Search from "@/components/Search/Search";
import { useCallback, useEffect, useState } from "react";
import List from "@/components/List/List";
import ToastModal from "@/components/ToastModal/ToastModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { Friend } from "@/types/friend.type";
import api from "@/api/api";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState<Friend[]>([]);

  const [groupName, setGroupName] = useState("");
  const [motto, setMotto] = useState("");

  const [keyword, setKeyword] = useState("");

  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false); // 그룹 생성 시도 여부 상태

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage3, setErrorMessage3] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await api.get("/api/settings/friends-list");
        const validFriends = Array.isArray(res.data)
          ? res.data.filter(
              (friend: Friend | null) => friend && friend.id && friend.nickname
            )
          : [];
        setFriendList(validFriends);
      } catch (err) {
        console.error("친구 목록 불러오기 오류:", err);
        setFriendList([]);
      }
    };

    fetchFriends();
  }, []);

  // 친구 선택/해제 핸들러
  const handleSelectFriend = useCallback(
    (id: number) => {
      setSelectedFriends((prev) => {
        if (prev.includes(id)) {
          // 이미 선택된 경우 선택 해제
          return prev.filter((friendId) => friendId !== id);
        } else {
          // 새로 선택하는 경우 4명 미만일 때만 추가 (생각해보니까 만드는 사람도 멤버 수 포함,,)
          if (prev.length < 4) {
            return [...prev, id];
          }
          return prev;
        }
      });
    },
    [selectedFriends]
  );

  // 선택된 친구 객체 목록 (검색해도 항상 상단에 고정)
  const selectedFriendObjects = friendList.filter(
    (friend) => friend && selectedFriends.includes(friend.id)
  );

  // 선택되지 않은 친구 목록 중 검색 키워드로 필터링
  const filteredUnselectedFriends = friendList.filter(
    (friend) =>
      friend &&
      !selectedFriends.includes(friend.id) &&
      friend.nickname.includes(keyword)
  );

  // 위 목록을 합쳐서 최종적으로 표시할 친구 목록 생성
  const displayedFriends = [
    ...selectedFriendObjects,
    ...filteredUnselectedFriends,
  ];

  // 그룹 생성 로직
  const handleCreateGroup = useCallback(async () => {
    setIsSubmitted(true); // 그룹 생성 버튼 클릭을 기록

    if (groupName.trim().length === 0) {
      setErrorMessage("그룹명을 입력해주세요.");
      setShowErrorToast(true);
      return; // 그룹명이 없으면 여기서 중단
    }

    if (groupName.length > 10) {
      setErrorMessage("그룹명은 10자 이내로");
      setErrorMessage3("입력해 주세요.");
      setShowErrorToast(true);
      return;
    }

    if (motto.length > 20) {
      setErrorMessage("메시지는 20자 이내로");
      setErrorMessage3("입력해 주세요.");
      setShowErrorToast(true);
      return;
    }

    if (selectedFriends.length > 4) {
      setErrorMessage("친구는 최대 4명까지");
      setErrorMessage3("초대할 수 있습니다.");
      setShowErrorToast(true);
      return;
    }

    try {
      // 그룹 생성 API 호출하고 생성된 그룹 ID를 받음
      const createGroupRes = await api.post("/api/groups", {
        name: groupName,
        motto: motto,
      });
      const newGroupId = createGroupRes.data.id;

      if (!newGroupId) {
        throw new Error("그룹 ID를 받아오지 못했습니다.");
      }

      // 선택된 친구가 있으면 초대 API 호출
      if (selectedFriends.length > 0) {
        // 모든 초대를 병렬로 처리
        await Promise.all(
          selectedFriends.map((friendId) =>
            api.post(`/api/groups/${newGroupId}/invite/${friendId}`)
          )
        );
      }

      // 모든 과정이 성공하면 토스트를 보여주고 페이지 이동
      setShowToast(true);
      setTimeout(() => {
        // 만들어진 그룹 ID 받는다면 그 그룹 상세 페이지로 바로 이동하는 식도 고려
        navigate("/friend-group");
      }, 1500);
    } catch (err) {
      console.error("그룹 생성 또는 초대 오류:", err);
      setErrorMessage("그룹 생성 또는 친구 초대에");
      setErrorMessage3("실패했습니다.");
      setShowErrorToast(true);
    }
  }, [groupName, motto, selectedFriends, navigate]);

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
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => {
              setShowErrorToast(false);
              setErrorMessage3("");
            }}
            text={errorMessage}
            {...(errorMessage3 && { text3: errorMessage3 })}
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="그룹 만들기"
          backgroundColor="primary"
          onClickXBtn={() => navigate("/friend-group")}
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
                  maxLength={10}
                />
                {isSubmitted && groupName.trim().length === 0 ? (
                  <S.ErrorMsg>그룹명을 입력해주세요.</S.ErrorMsg>
                ) : (
                  <div>10자 이내</div>
                )}
              </S.InputBox>
              <S.InputBox>
                <Input
                  placeholder="메시지 설정"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  maxLength={20}
                />
                <div>20자 이내</div>
              </S.InputBox>
            </S.InputContainer>
          </S.NavyBox>
          <S.Main>
            <S.TitleContainer>
              <S.TitleLine>
                <S.Title>친구 초대하기</S.Title>
                <S.InviteCount>{selectedFriends.length}/4</S.InviteCount>
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
                      friend={friend}
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
                    <Button title="그룹 만들기" onClick={handleCreateGroup} />
                  </S.EmptyFriendContainer>
                )}
              </S.FriendList>
            </S.FriendListContainer>
          </S.Main>
        </S.Content>
        {displayedFriends.length > 0 && (
          <S.BtnBox>
            <Button title="그룹 만들기" onClick={handleCreateGroup} />
          </S.BtnBox>
        )}
      </S.Container>
    </>
  );
}

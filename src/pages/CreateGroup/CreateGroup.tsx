import Header from "@/components/Header/Header";
import * as S from "./CreateGroup.styles";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/Button";
import { useCallback, useMemo, useState } from "react";
import PageTitle from "@/components/PageTitle/PageTitle";
import useDebounce from "@/hooks/useDebounce";
import type { Friend } from "@/types/friend.type";
import { useFriendsQuery } from "@/hooks/useFriendQueries";
import {
  useCreateGroupMutation,
  useInviteGroupMemberMutation,
} from "@/hooks/useGroupQueries";
import CreateGroupInviteStep from "./components/CreateGroupInviteStep";
import CreateGroupStepFields from "./components/CreateGroupStepFields";
import CreateGroupToasts from "./components/CreateGroupToasts";

export default function CreateGroup() {
  const navigate = useNavigate();
  const { data: friends = [] } = useFriendsQuery();
  const { mutateAsync: createGroup } = useCreateGroupMutation();
  const { mutateAsync: inviteGroupMember } = useInviteGroupMemberMutation();

  const [groupName, setGroupName] = useState("");
  const [motto, setMotto] = useState("");

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);

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
      friend.nickname.includes(debouncedKeyword)
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
      const createGroupRes = await createGroup({
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
            inviteGroupMember({ groupId: newGroupId, friendId })
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
  }, [
    createGroup,
    groupName,
    inviteGroupMember,
    motto,
    navigate,
    selectedFriends,
  ]);

  const [step, setStep] = useState(1);

  return (
    <>
      <PageTitle title="그룹 만들기" />
      <S.Container>
        <CreateGroupToasts
          showSuccessToast={showToast}
          showErrorToast={showErrorToast}
          errorMessage={errorMessage}
          errorMessage3={errorMessage3}
          onCloseSuccessToast={() => setShowToast(false)}
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
            selectedFriends={selectedFriends}
            onChangeKeyword={setKeyword}
            onClearKeyword={() => setKeyword("")}
            onSelectFriend={handleSelectFriend}
            onMoveToFriendGroup={() => navigate("/friend-group")}
            onCreateGroup={handleCreateGroup}
          />
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

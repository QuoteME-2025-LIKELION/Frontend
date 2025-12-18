import { useNavigate, useParams } from "react-router-dom";
import * as S from "./InviteStyle";
import Header from "@/components/Header/Header";
import Search from "@/components/Search/Search";
import { useCallback, useEffect, useState } from "react";
import List from "@/components/List/List";
import ToastModal from "@/components/ToastModal/ToastModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import api from "@/api/api";
import type { Friend } from "@/types/friend.type";
import useDebounce from "@/hooks/useDebounce";
import type { AxiosError } from "axios";

export default function Invite() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce<string>(keyword, 500); // 디바운스 적용
  const [selectedFriend, setSelectedFriend] = useState(""); // 초대할 친구 이름 상태
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null); // 초대할 친구 ID 상태

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);

  // API로부터 직접 받아올 상태들
  const [groupName, setGroupName] = useState("");
  const [currentMembers, setCurrentMembers] = useState<Friend[]>([]);

  // groupId 유효성 검사
  useEffect(() => {
    // 형식 검사 (숫자인지)
    if (!groupId || isNaN(Number(groupId))) {
      navigate("/*", { replace: true });
      return;
    }

    const fetchGroupData = async () => {
      try {
        const res = await api.get(`/api/groups/${groupId}`);
        setGroupName(res.data.name);
        setCurrentMembers(res.data.members || []);
      } catch (err: AxiosError | any) {
        if (err.response && err.response.status === 500) {
          navigate("/*", { replace: true });
        }
        console.error("그룹 정보 조회 중 오류 발생:", err);
      }
    };

    fetchGroupData();
  }, [groupId, navigate]);

  // 친구 목록 조회 및 검색
  useEffect(() => {
    const fetchAndFilterFriends = async () => {
      try {
        let friendsList: Friend[];

        if (debouncedKeyword) {
          // 검색어가 있으면 검색 API 호출
          const res = await api.get(
            `/api/settings/search?keyword=${debouncedKeyword}`
          );
          friendsList = res.data.members;
        } else {
          // 검색어가 없으면 전체 친구 목록 API 호출
          const res = await api.get("/api/settings/friends-list");
          friendsList = res.data;
        }

        // 현재 그룹 멤버의 ID 목록을 Set으로 만들어 빠른 조회를 가능하게 함
        const currentMemberIds = new Set(
          currentMembers.map((member: Friend) => member.id)
        );

        // API 결과에서 현재 그룹 멤버를 제외
        const friendsToDisplay = friendsList.filter(
          (friend) => !currentMemberIds.has(friend.id)
        );

        setFilteredFriends(friendsToDisplay);
      } catch (err) {
        console.error("친구 목록 처리 중 오류:", err);
        setFilteredFriends([]); // 오류 발생 시 목록 비우기
      }
    };

    if (currentMembers.length > 0) {
      fetchAndFilterFriends();
    }
  }, [debouncedKeyword, currentMembers]); // 디바운스된 키워드나 그룹 멤버가 바뀔 때마다 실행

  // 친구 초대 핸들러
  const handleInviteFriend = useCallback(
    (friendName: string, friendId: number) => {
      setSelectedFriend(friendName);
      setSelectedFriendId(friendId);
      setShowInviteModal(true);
    },
    [selectedFriendId, selectedFriend]
  );
  const handleConfirmInvite = useCallback(async () => {
    setShowInviteModal(false);
    if (currentMembers.length < 5) {
      try {
        await api.post(`/api/groups/${groupId}/invite/${selectedFriendId}`);

        // 초대에 성공하면 친구 목록에서 해당 친구 제거
        setFilteredFriends((prevFriends) =>
          prevFriends.filter((friend: Friend) => friend.id !== selectedFriendId)
        );

        // 초대 성공 시 현재 멤버 목록에도 추가
        const invitedFriend = filteredFriends.find(
          (f) => f.id === selectedFriendId
        );
        if (invitedFriend) {
          setCurrentMembers((prev) => [...prev, invitedFriend]);
        }
        setShowSuccessToast(true);
      } catch (err) {
        console.error("그룹원 초대 오류:", err);
      }
    } else {
      setShowErrorToast(true);
    }
  }, [currentMembers.length, groupId, selectedFriendId]);
  return (
    <>
      <PageTitle title="그룹 초대하기" />
      <S.Container>
        {showInviteModal && (
          <ConfirmModal
            nickname={selectedFriend}
            question="님을"
            nickname2={groupName}
            question2="에 초대할까요?"
            onClose={() => setShowInviteModal(false)}
            onConfirm={handleConfirmInvite}
            showOverlay={false}
          />
        )}
        {showSuccessToast && (
          <ToastModal
            text="초대되었습니다."
            isVisible={showSuccessToast}
            onClose={() => setShowSuccessToast(false)}
            showOverlay={false}
          />
        )}
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            text="그룹원이"
            redText="5인을 초과"
            text2="하여"
            text3="초대가 불가능합니다."
            showOverlay={false}
            onClose={() => setShowErrorToast(false)}
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title=""
          backgroundColor="white"
          onClickXBtn={() => navigate(`/group/${groupId}`)}
        />
        <S.Content>
          <Search
            placeholder="검색"
            desc={
              keyword && filteredFriends.length === 0
                ? "검색 결과가 없습니다."
                : "나의 친구 중에서만 초대할 수 있어요."
            }
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword("")}
          />
          <S.FriendList>
            <S.Title>친구</S.Title>
            {filteredFriends.map((friend: Friend) => (
              <List
                key={friend.id}
                friend={friend}
                actionButton={{
                  type: "invite",
                  text: "초대",
                  onClick: () => handleInviteFriend(friend.nickname, friend.id),
                }}
              />
            ))}
          </S.FriendList>
        </S.Content>
      </S.Container>
    </>
  );
}

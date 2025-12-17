import Header from "@/components/Header/Header";
import * as S from "./PagesStyle";
import { useNavigate } from "react-router-dom";
import GroupCard from "@/pages/FriendGroup/components/GroupCard";
import { useCallback, useEffect, useState } from "react";
import ToastModal from "@/components/ToastModal/ToastModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { Group } from "@/types/group.type";
import api from "@/api/api";

export default function MyGroups() {
  const navigate = useNavigate();
  const [groupsData, setGroupsData] = useState<Group[]>([]);

  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showQuitToast, setShowQuitToast] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(""); // 탈퇴할 그룹 이름 상태
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null); // 탈퇴할 그룹 ID 상태

  const [showErrorToast, setShowErrorToast] = useState(false);

  const fetchMyGroups = useCallback(async () => {
    try {
      const res = await api.get("/api/groups/me");
      setGroupsData(res.data);
    } catch (err) {
      console.error("내 그룹 불러오기 오류:", err);
      setGroupsData([]);
    }
  }, []);

  // 컴포넌트 마운트 시 내 그룹 불러오기
  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  const handleQuitGroup = useCallback((groupName: string, groupId: number) => {
    setSelectedGroup(groupName);
    setSelectedGroupId(groupId);
    setShowQuitModal(true);
  }, []);

  const handleConfirmQuit = useCallback(async () => {
    setShowQuitModal(false);
    try {
      // 내 프로필에서 내 ID 가져오기
      const profileRes = await api.get("/api/profile");
      const myId = profileRes.data.id;

      if (myId === null) {
        // myId를 가져오지 못하면 에러를 발생시켜 catch로 이동
        throw new Error("사용자 ID를 가져올 수 없습니다.");
      }

      // 가져온 내 ID로 그룹 탈퇴 API 호출
      await api.delete(`/api/groups/${selectedGroupId}/members/${myId}`);

      setShowQuitToast(true);
      // 그룹 목록 다시 불러오기
      fetchMyGroups();
    } catch (err) {
      console.error("그룹 탈퇴 처리 중 오류:", err);
      setShowErrorToast(true);
    }
  }, [selectedGroupId, fetchMyGroups]);
  return (
    <>
      <PageTitle title="나의 그룹 관리" />
      <S.Container>
        {showQuitModal && (
          <ConfirmModal
            nickname={selectedGroup}
            question="에서 탈퇴하시겠습니까?"
            onClose={() => setShowQuitModal(false)}
            onConfirm={handleConfirmQuit}
          />
        )}
        {showQuitToast && (
          <ToastModal
            text="그룹을 탈퇴하였습니다."
            isVisible={showQuitToast}
            onClose={() => setShowQuitToast(false)}
          />
        )}
        {showErrorToast && (
          <ToastModal
            isVisible={showErrorToast}
            onClose={() => setShowErrorToast(false)}
            text="그룹 탈퇴에 실패했습니다."
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="나의 그룹 관리"
          backgroundColor="white"
          onClickXBtn={() => navigate("/friend-group")}
        />
        <S.Content>
          {groupsData.length > 0 ? (
            groupsData.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onBtnClick={() => handleQuitGroup(group.name!, group.id)}
                isButton={true}
                onCardClick={() => navigate(`/group/${group.id}`)}
              />
            ))
          ) : (
            <S.EmptyBox>참여 중인 그룹이 없습니다.</S.EmptyBox>
          )}
        </S.Content>
      </S.Container>
    </>
  );
}

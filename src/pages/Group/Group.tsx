import Header from "@/components/Header/Header";
import * as S from "./GroupStyle";
import { useNavigate, useParams } from "react-router-dom";
import List from "@/components/List/List";
import Button from "@/components/Button/Button";
import { useCallback, useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import type { Group } from "@/types/group.type";
import api from "@/api/api";
import type { Friend } from "@/types/friend.type";

export default function Group() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState<Group | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [selectedMember, setSelectedMember] = useState(""); // 삭제할 그룹원 이름 상태
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null); // 삭제할 그룹원 ID 상태

  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showQuitToast, setShowQuitToast] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const res = await api.get(`/api/groups/${groupId}`);
        setGroupData(res.data);
      } catch (err) {
        console.error("그룹 데이터 불러오기 오류:", err);
        setGroupData(null);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleDeleteMember = useCallback((userName: string, userId: number) => {
    setSelectedMember(userName);
    setSelectedMemberId(userId);
    setShowDeleteModal(true);
  }, []);
  const handleConfirmDelete = useCallback(async () => {
    try {
      await api.delete(`/api/groups/${groupId}/members/${selectedMemberId}`);

      // 성공 시 UI 업데이트
      setShowDeleteModal(false);
      setShowDeleteToast(true);

      // 그룹 데이터 다시 불러오기
      const res = await api.get(`/api/groups/${groupId}`);
      setGroupData(res.data);
    } catch (err) {
      console.error("그룹원 삭제 오류:", err);
      setShowDeleteModal(false);
      alert("삭제에 실패했습니다.");
    }
  }, [groupId, selectedMemberId]);

  const handleQuitGroup = useCallback(() => {
    setShowQuitModal(true);
  }, []);
  const handleConfirmQuit = useCallback(async () => {
    try {
      // 내 프로필에서 내 ID 가져오기
      const profileRes = await api.get("/api/profile");
      const myId = profileRes.data.id;

      if (myId === null) {
        // myId를 가져오지 못하면 에러를 발생시켜 catch로 이동
        throw new Error("사용자 ID를 가져올 수 없습니다.");
      }

      // 가져온 내 ID로 그룹 탈퇴 API 호출
      await api.delete(`/api/groups/${groupId}/members/${myId}`);

      setShowQuitModal(false);
      setShowQuitToast(true);

      setTimeout(() => {
        navigate("/group");
      }, 1500);
    } catch (err) {
      console.error("그룹 탈퇴 처리 중 오류:", err);
      setShowQuitModal(false);
      alert("그룹 탈퇴에 실패했습니다.");
    }
  }, [groupId, navigate]);
  return (
    <>
      <PageTitle title={groupData?.name || "그룹 상세"} />
      <S.Container>
        {showDeleteModal && (
          <ConfirmModal
            nickname={selectedMember}
            question="님을 삭제하시겠습니까?"
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            showOverlay={true}
          />
        )}
        {showDeleteToast && (
          <ToastModal
            text="그룹원이 삭제되었습니다."
            isVisible={showDeleteToast}
            onClose={() => setShowDeleteToast(false)}
          />
        )}
        {showQuitModal && (
          <ConfirmModal
            question="그룹을 탈퇴하시겠습니까?"
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
        <Header
          showBackBtn={true}
          showXBtn={false}
          title=""
          backgroundColor="secondary"
          onClickBackBtn={() => navigate(-1)}
        />
        <S.Content>
          <S.GrayBox>
            {/* 회색 배경 */}
            <S.GroupCard>
              {/* GroupCard처럼 */}
              <S.TextBox>
                <S.Title>{groupData?.name}</S.Title>
                <S.InfoBox>
                  <S.InfoLine>
                    <div>멤버</div>
                    <div>{groupData?.memberCount}명</div>
                  </S.InfoLine>
                  <S.InfoLine>
                    <div>명언</div>
                    <div>{groupData?.totalQuoteCount}개</div>
                  </S.InfoLine>
                  <S.InfoLine>
                    <div>since</div>
                    <S.Chonburi>{groupData?.createdAt?.slice(0, 4)}</S.Chonburi>
                  </S.InfoLine>
                </S.InfoBox>
              </S.TextBox>
              <S.Count>{groupData?.memberCount}</S.Count>
            </S.GroupCard>
          </S.GrayBox>
          <S.Main>
            <S.Section>
              <S.Title>그룹 메시지</S.Title>
              <S.MessageBox
                onClick={() =>
                  navigate(`/group/${groupId}/change-message`, {
                    state: { currentMotto: groupData?.motto },
                  })
                }
              >
                <S.Quotation>“</S.Quotation>
                {groupData?.motto ? (
                  <S.Text>{groupData?.motto}</S.Text>
                ) : (
                  <S.EmptyText>메시지를 입력하세요</S.EmptyText>
                )}
                <S.Quotation>”</S.Quotation>
              </S.MessageBox>
            </S.Section>
            <S.Section>
              <S.Title>그룹원</S.Title>
              {groupData?.members?.map((friend) => (
                <List
                  key={friend.id}
                  friend={friend}
                  actionButton={{
                    type: "delete",
                    text: "삭제",
                    onClick: () =>
                      handleDeleteMember(friend.nickname, friend.id),
                  }}
                />
              ))}
            </S.Section>
            <S.BtnBox>
              <Button
                title="그룹 초대하기"
                onClick={() =>
                  navigate(`/group/${groupId}/invite`, {
                    state: {
                      currentMembers: (groupData?.members as Friend[]) || [],
                      groupName: groupData?.name,
                    },
                  })
                }
              />
              <S.QuitBtn onClick={handleQuitGroup}>그룹 탈퇴하기</S.QuitBtn>
            </S.BtnBox>
          </S.Main>
        </S.Content>
      </S.Container>
    </>
  );
}

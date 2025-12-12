import Header from "@/components/Header/Header";
import * as S from "./GroupStyle";
import { useNavigate } from "react-router-dom";
import List from "@/components/List/List";
import Button from "@/components/Button/Button";
import { useCallback, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { MOCK_FRIENDS } from "@/data/friends";

export default function Group() {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [selectedMember, setSelectedMember] = useState(""); // 삭제할 그룹원 이름 상태

  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showQuitToast, setShowQuitToast] = useState(false);

  const handleDeleteMember = useCallback((userName: string) => {
    setSelectedMember(userName);
    setShowDeleteModal(true);
  }, []);
  const handleConfirmDelete = useCallback(() => {
    setShowDeleteModal(false);
    setShowDeleteToast(true);
  }, []);

  const handleQuitGroup = useCallback(() => {
    setShowQuitModal(true);
  }, []);
  const handleConfirmQuit = useCallback(() => {
    setShowQuitModal(false);
    setShowQuitToast(true);
  }, []);
  return (
    <>
      {/* 타이틀 그룹명으로 추후 변경 */}
      <PageTitle title="무니니" />
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
                <S.Title>무니니</S.Title>
                <S.InfoBox>
                  <S.InfoLine>
                    <div>멤버</div>
                    <div>3명</div>
                  </S.InfoLine>
                  <S.InfoLine>
                    <div>명언</div>
                    <div>30개</div>
                  </S.InfoLine>
                  <S.InfoLine>
                    <div>since</div>
                    <S.Chonburi>2025</S.Chonburi>
                  </S.InfoLine>
                </S.InfoBox>
              </S.TextBox>
              <S.Count>3</S.Count>
            </S.GroupCard>
          </S.GrayBox>
          <S.Main>
            <S.Section>
              <S.Title>그룹 메시지</S.Title>
              {/* group 페이지 url 수정 시 링크도 같이 수정 */}
              <S.MessageBox onClick={() => navigate("/group/change-message")}>
                <S.Quotation>“</S.Quotation>
                <S.EmptyText>메시지를 입력하세요</S.EmptyText>
                {/* {Message.length > 0 ? (
                <S.Text>{message}</S.Text>
              ) : (
                <S.EmptyText>메시지를 입력하세요</S.EmptyText>
              )} */}
                <S.Quotation>”</S.Quotation>
              </S.MessageBox>
            </S.Section>
            <S.Section>
              <S.Title>그룹원</S.Title>
              {MOCK_FRIENDS.map((friend) => (
                <List
                  key={friend.id}
                  friend={friend}
                  actionButton={{
                    type: "delete",
                    text: "삭제",
                    onClick: () => handleDeleteMember(friend.nickname),
                  }}
                />
              ))}
            </S.Section>
            <S.BtnBox>
              {/* group 페이지 url 수정 시 링크도 같이 수정 */}
              <Button
                title="그룹 초대하기"
                onClick={() => navigate("/group/invite")}
              />
              <S.QuitBtn onClick={handleQuitGroup}>그룹 탈퇴하기</S.QuitBtn>
            </S.BtnBox>
          </S.Main>
        </S.Content>
      </S.Container>
    </>
  );
}

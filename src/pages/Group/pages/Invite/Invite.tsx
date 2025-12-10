import { useNavigate } from "react-router-dom";
import * as S from "./InviteStyle";
import Header from "@/components/Header/Header";
import Search from "@/components/Search/Search";
import { useCallback, useState } from "react";
import List from "@/components/List/List";
import ToastModal from "@/components/ToastModal/ToastModal";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function Invite() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(""); // 초대할 친구 이름 상태

  // 추후 useParams() 로 그룹 id -> 그룹 이름 매핑 필요
  const GROUP_NAME = "무니니";
  const GROUP_MEMBER_COUNT = 4; // 임시 그룹 멤버 수

  const handleInviteFriend = useCallback((friendName: string) => {
    setSelectedFriend(friendName);
    setShowInviteModal(true);
  }, []);

  const handleConfirmInvite = useCallback(() => {
    setShowInviteModal(false);
    if (GROUP_MEMBER_COUNT < 5) {
      setShowSuccessToast(true);
    } else {
      setShowErrorToast(true);
    }
  }, []);
  return (
    <>
      <PageTitle title="그룹 초대하기" />
      <S.Container>
        {showInviteModal && (
          <ConfirmModal
            nickname={selectedFriend}
            question="님을"
            nickname2={GROUP_NAME}
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
          onClickXBtn={() => navigate(-1)}
        />
        <S.Content>
          <Search
            placeholder="검색"
            desc="나의 친구 중에서만 초대할 수 있어요."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword("")}
          />
          <S.FriendList>
            <S.Title>친구</S.Title>
            <List
              profileImgUrl="https://avatars.githubusercontent.com/u/189887138?v=4"
              username="듀랄라"
              intro="Positive Thinking"
              actionButton={{
                type: "invite",
                text: "초대",
                onClick: () => handleInviteFriend("듀랄라"),
              }}
            />
          </S.FriendList>
        </S.Content>
      </S.Container>
    </>
  );
}

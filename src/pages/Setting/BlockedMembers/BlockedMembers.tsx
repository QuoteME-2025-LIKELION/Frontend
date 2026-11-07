import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import UserListItem from "@/components/UserListItem/UserListItem";
import useAuthStore from "@/stores/useAuthStore";
import { EMPTY_BLOCKED_MEMBERS, isModerationPreview, useModerationPreviewStore } from "@/stores/useModerationPreviewStore";

import * as S from "./BlockedMembers.styles";

export default function BlockedMembers() {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.sessionVersion);
  const members = useModerationPreviewStore((state) => state.blockedBySession[session] ?? EMPTY_BLOCKED_MEMBERS);
  const unblock = useModerationPreviewStore((state) => state.unblock);
  const [toast, setToast] = useState("");

  return (
    <S.Container>
      <PageTitle title="차단 목록" />
      <Header title="차단 목록" showBackBtn showXBtn={false} backgroundColor="secondary"
        onClickBackBtn={() => navigate("/account-setting")} />
      <S.List>
        {isModerationPreview ? members.length ? members.map((member) => (
          <UserListItem key={member.memberId} friend={{
            id: member.memberId,
            nickname: member.nickname,
            introduction: member.introduction,
            profileImage: member.profileImage,
          }} actionButton={{ type: "delete", text: "차단 해제", onClick: () => {
            unblock(session, member.memberId);
            setToast("차단을 해제했어요.");
          } }} />
        )) : <S.Empty>차단한 사용자가 없어요.</S.Empty>
          : <S.Empty>차단 목록을 준비 중이에요.</S.Empty>}
      </S.List>
      {toast && <ToastModal text={toast} isVisible onClose={() => setToast("")} showOverlay={false} variant="snackbar" />}
    </S.Container>
  );
}

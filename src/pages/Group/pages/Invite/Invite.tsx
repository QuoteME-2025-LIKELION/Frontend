import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import Search from "@/components/Search/Search";
import ToastModal from "@/components/ToastModal/ToastModal";
import UserListItem from "@/components/UserListItem/UserListItem";
import useDebounce from "@/hooks/useDebounce";
import {
  useFriendSearchQuery,
  useFriendsQuery,
} from "@/hooks/useFriendQueries";
import {
  useGroupQuery,
  useInviteGroupMemberMutation,
} from "@/hooks/useGroupQueries";
import type { Friend } from "@/types/friend.type";

import * as S from "./Invite.styles";

const EMPTY_FRIENDS: Friend[] = [];

type InviteTarget = {
  id: number;
  nickname: string;
};

export default function Invite() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const isValidGroupId = Boolean(groupId && !isNaN(Number(groupId)));

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce<string>(keyword, 500); // 디바운스 적용
  const [inviteTarget, setInviteTarget] = useState<InviteTarget | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const { data: groupData, error: groupError } = useGroupQuery(
    isValidGroupId ? groupId : undefined
  );
  const { data: friends = EMPTY_FRIENDS } = useFriendsQuery(
    Boolean(groupData) && !debouncedKeyword
  );
  const { data: searchResult } = useFriendSearchQuery(
    debouncedKeyword,
    Boolean(groupData) && Boolean(debouncedKeyword)
  );
  const { mutateAsync: inviteGroupMember } = useInviteGroupMemberMutation();

  const currentMembers = groupData?.members || EMPTY_FRIENDS;
  const friendsList = debouncedKeyword
    ? searchResult?.members || EMPTY_FRIENDS
    : friends;
  const filteredFriends = useMemo(() => {
    const currentMemberIds = new Set(currentMembers.map((member) => member.id));

    return friendsList.filter((friend) => !currentMemberIds.has(friend.id));
  }, [currentMembers, friendsList]);

  // groupId 유효성 검사
  useEffect(() => {
    // 형식 검사 (숫자인지)
    if (!isValidGroupId) {
      navigate("/not-found", { replace: true });
    }
  }, [isValidGroupId, navigate]);

  useEffect(() => {
    if (axios.isAxiosError(groupError) && groupError.response?.status === 500) {
      navigate("/not-found", { replace: true });
    }
  }, [groupError, navigate]);

  const handleInviteFriend = useCallback(
    (friendName: string, friendId: number) => {
      setInviteTarget({ id: friendId, nickname: friendName });
    },
    []
  );
  const handleConfirmInvite = useCallback(async () => {
    if (!inviteTarget || !groupId) {
      console.error("초대할 친구 또는 그룹 ID가 유효하지 않습니다.");
      setShowErrorToast(true);
      return;
    }

    if (currentMembers.length < 5) {
      try {
        await inviteGroupMember({ groupId, friendId: inviteTarget.id });
        setInviteTarget(null);
        setShowSuccessToast(true);
      } catch (err) {
        console.error("그룹원 초대 오류:", err);
        setInviteTarget(null);
        setShowErrorToast(true);
      }
    } else {
      setInviteTarget(null);
      setShowErrorToast(true);
    }
  }, [currentMembers.length, groupId, inviteGroupMember, inviteTarget]);
  return (
    <>
      <PageTitle title="그룹 초대하기" />
      <S.Container>
        {inviteTarget && (
          <ConfirmModal
            question=""
            lines={[
              `${inviteTarget.nickname}님을 그룹에`,
              "초대하시겠어요?",
            ]}
            onClose={() => setInviteTarget(null)}
            onConfirm={handleConfirmInvite}
            showOverlay={false}
            cancelText="돌아가기"
            confirmText="초대하기"
            confirmColor="primary"
            variant="card"
          />
        )}
        {showSuccessToast && (
          <ToastModal
            text="초대되었습니다."
            isVisible={showSuccessToast}
            onClose={() => setShowSuccessToast(false)}
            showOverlay={false}
            variant="snackbar"
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
            variant="snackbar"
            onClose={() => setShowErrorToast(false)}
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title=""
          backgroundColor="secondary"
          onClickXBtn={() => navigate(`/group/${groupId}`)}
        />
        <S.Content>
          <Search
            placeholder="검색어를 입력해 주세요"
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
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend: Friend) => (
                <UserListItem
                  key={friend.id}
                  friend={friend}
                  actionButton={{
                    type: "invite",
                    text: "초대",
                    onClick: () =>
                      handleInviteFriend(friend.nickname, friend.id),
                  }}
                />
              ))
            ) : (
              <S.EmptyBox>초대할 수 있는 친구가 없습니다.</S.EmptyBox>
            )}
          </S.FriendList>
        </S.Content>
      </S.Container>
    </>
  );
}

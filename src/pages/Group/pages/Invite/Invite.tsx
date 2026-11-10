import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import Header from "@/components/Header/Header";
import PageTitle from "@/components/PageTitle/PageTitle";
import Search from "@/components/Search/Search";
import ToastModal from "@/components/ToastModal/ToastModal";
import UserListItem from "@/components/UserListItem/UserListItem";
import { useFriendsQuery } from "@/hooks/queries/useFriendQueries";
import {
  useCancelGroupInvitationMutation,
  useGroupQuery,
  useGroupSentInvitationsQuery,
  useInviteGroupMemberMutation,
} from "@/hooks/queries/useGroupQueries";
import useDebounce from "@/hooks/ui/useDebounce";
import type { Friend } from "@/types/friend.type";

import * as S from "./Invite.styles";

const EMPTY_FRIENDS: Friend[] = [];

type InviteTarget = {
  id: number;
  nickname: string;
  introduction?: string;
  profileImage?: string;
};

export default function Invite() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const isValidGroupId = Boolean(groupId && !isNaN(Number(groupId)));

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce<string>(keyword, 500); // 디바운스 적용
  const [inviteTarget, setInviteTarget] = useState<InviteTarget | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showLinkInviteToast, setShowLinkInviteToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const actionLock = useRef(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");
  const [showFullGroupToast, setShowFullGroupToast] = useState(false);

  const { data: groupData, error: groupError } = useGroupQuery(
    isValidGroupId ? groupId : undefined
  );
  const {
    data: friends = EMPTY_FRIENDS,
    isPending: isFriendsPending,
    isError: isFriendsError,
  } = useFriendsQuery(Boolean(groupData));
  const {
    data: sentInvitations = [],
    isPending: isInvitationsPending,
    isError: isInvitationsError,
  } = useGroupSentInvitationsQuery(isValidGroupId ? groupId : undefined);
  const { mutateAsync: inviteGroupMember } = useInviteGroupMemberMutation();
  const { mutateAsync: cancelGroupInvitation } =
    useCancelGroupInvitationMutation();

  const currentMembers = groupData?.members || EMPTY_FRIENDS;
  const isListPending = isFriendsPending || isInvitationsPending;
  const isListError = isFriendsError || isInvitationsError;
  const filteredFriends = useMemo(() => {
    const currentMemberIds = new Set(currentMembers.map((member) => member.id));
    const pendingInviteIds = new Set(
      sentInvitations.map((invitation) => invitation.requesterId)
    );
    const search = debouncedKeyword.trim().toLocaleLowerCase();
    return friends.filter(
      (friend) =>
        !currentMemberIds.has(friend.id) &&
        !pendingInviteIds.has(friend.id) &&
        friend.nickname.toLocaleLowerCase().includes(search)
    );
  }, [currentMembers, friends, sentInvitations, debouncedKeyword]);

  // groupId 유효성 검사
  useEffect(() => {
    // 형식 검사 (숫자인지)
    if (!isValidGroupId) {
      navigate("/not-found", { replace: true });
    }
  }, [isValidGroupId, navigate]);

  useEffect(() => {
    if (
      axios.isAxiosError(groupError) &&
      [404, 500].includes(groupError.response?.status ?? 0)
    ) {
      navigate("/not-found", { replace: true });
    }
  }, [groupError, navigate]);

  const handleInviteFriend = useCallback(
    (friend: Friend) => {
      if (actionLock.current || isListPending || isListError) return;
      setInviteTarget(friend);
    },
    [isListPending, isListError]
  );
  const handleConfirmInvite = useCallback(async () => {
    if (actionLock.current) return;
    if (!inviteTarget || !groupId) {
      console.error("초대할 친구 또는 그룹 ID가 유효하지 않습니다.");
      setErrorToastMessage("초대 정보를 확인할 수 없습니다.");
      return;
    }

    if (currentMembers.length >= 5) {
      setInviteTarget(null);
      setShowFullGroupToast(true);
      return;
    }

    actionLock.current = true;
    setIsProcessing(true);
    try {
      await inviteGroupMember({ groupId, friendId: inviteTarget.id });
      setInviteTarget(null);
      setSuccessMessage("초대 요청을 보냈어요");
    } catch (err) {
      console.error("그룹원 초대 오류:", err);
      setInviteTarget(null);
      setErrorToastMessage("초대 요청 전송에 실패했습니다.");
    } finally {
      actionLock.current = false;
      setIsProcessing(false);
    }
  }, [currentMembers.length, groupId, inviteGroupMember, inviteTarget]);

  const handleCancelInvitation = useCallback(
    async (requestId: number) => {
      if (!groupId || actionLock.current) return;
      actionLock.current = true;
      setIsProcessing(true);
      try {
        await cancelGroupInvitation({ groupId, requestId });
        setSuccessMessage("그룹 초대를 취소했어요");
      } catch {
        setErrorToastMessage(
          "그룹 초대 취소에 실패했어요. 다시 시도해 주세요."
        );
      } finally {
        actionLock.current = false;
        setIsProcessing(false);
      }
    },
    [groupId, cancelGroupInvitation]
  );

  return (
    <>
      <PageTitle title="멤버 초대하기" />
      <S.Container>
        {inviteTarget && (
          <ConfirmModal
            question=""
            lines={[`${inviteTarget.nickname}님을 그룹에`, "초대할까요?"]}
            onClose={() => {
              if (!actionLock.current) setInviteTarget(null);
            }}
            confirmDisabled={isProcessing}
            onConfirm={handleConfirmInvite}
            showOverlay={false}
            cancelText="돌아가기"
            confirmText="초대하기"
            confirmColor="primary"
            variant="card"
          />
        )}
        {successMessage && (
          <ToastModal
            text={successMessage}
            isVisible={Boolean(successMessage)}
            onClose={() => setSuccessMessage("")}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        {showLinkInviteToast && (
          <ToastModal
            text="아직 구현되지 않은 기능이에요"
            isVisible={showLinkInviteToast}
            onClose={() => setShowLinkInviteToast(false)}
            showOverlay={false}
            variant="snackbar"
          />
        )}
        {showFullGroupToast && (
          <ToastModal
            isVisible={showFullGroupToast}
            text=""
            redText="최대 인원 5명이 가득 차 더 이상 초대할 수 없어요"
            showOverlay={false}
            variant="snackbar"
            onClose={() => setShowFullGroupToast(false)}
          />
        )}
        {errorToastMessage && (
          <ToastModal
            isVisible={Boolean(errorToastMessage)}
            text={errorToastMessage}
            showOverlay={false}
            variant="snackbar"
            onClose={() => setErrorToastMessage("")}
          />
        )}
        <Header
          showBackBtn={false}
          showXBtn={true}
          title="멤버 초대하기"
          backgroundColor="secondary"
          onClickXBtn={() => navigate(`/group/${groupId}`)}
        />
        <S.Content>
          <Search
            label="그룹에 초대할 친구 검색"
            placeholder="검색어를 입력해 주세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onClear={() => setKeyword("")}
          />
          <S.FriendList>
            {isListPending ? (
              <S.EmptyBox>목록을 불러오고 있어요</S.EmptyBox>
            ) : isListError ? (
              <S.EmptyBox>
                목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
              </S.EmptyBox>
            ) : filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <UserListItem
                  key={friend.id}
                  friend={friend}
                  actionButton={{
                    type: "invite",
                    text: "초대",
                    disabled: isProcessing,
                    onClick: () => handleInviteFriend(friend),
                  }}
                />
              ))
            ) : (
              <S.EmptyBox>
                {debouncedKeyword.trim()
                  ? "검색 결과가 없습니다."
                  : "초대할 수 있는 친구가 없습니다."}
              </S.EmptyBox>
            )}
          </S.FriendList>
          {sentInvitations.length > 0 && (
            <S.PendingSection>
              <S.Title role="heading" aria-level={2}>
                초대 대기
              </S.Title>
              <S.FriendList>
                {sentInvitations.map((invitation) => (
                  <UserListItem
                    key={invitation.requestId}
                    friend={{
                      id: invitation.requesterId,
                      nickname: invitation.requesterNickname,
                      profileImage:
                        invitation.requesterProfileImage ?? undefined,
                      introduction: invitation.requesterIntroduction,
                    }}
                    actionButton={{
                      type: "invite",
                      text: "취소",
                      disabled: isProcessing,
                      onClick: () => {
                        void handleCancelInvitation(invitation.requestId);
                      },
                    }}
                  />
                ))}
              </S.FriendList>
            </S.PendingSection>
          )}
        </S.Content>
        <S.Footer>
          <S.LinkInviteButton
            type="button"
            onClick={() => setShowLinkInviteToast(true)}
          >
            링크로 초대하기
          </S.LinkInviteButton>
        </S.Footer>
      </S.Container>
    </>
  );
}

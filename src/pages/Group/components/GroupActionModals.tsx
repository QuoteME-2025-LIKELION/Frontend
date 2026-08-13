import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";

export type GroupMemberActionTarget = {
  id: number;
  nickname: string;
};

export type GroupActionConfirm = "quit" | "delete" | null;

interface GroupActionModalsProps {
  deleteMemberTarget: GroupMemberActionTarget | null;
  groupActionConfirm: GroupActionConfirm;
  showDeleteToast: boolean;
  showQuitToast: boolean;
  showGroupDeleteToast: boolean;
  showErrorToast: boolean;
  errorMessage: string;
  onCloseDeleteMember: () => void;
  onConfirmDeleteMember: () => void;
  onCloseGroupAction: () => void;
  onConfirmQuitGroup: () => void;
  onConfirmDeleteGroup: () => void;
  onCloseDeleteToast: () => void;
  onCloseQuitToast: () => void;
  onCloseGroupDeleteToast: () => void;
  onCloseErrorToast: () => void;
}

/**
 * 그룹 상세 화면의 확인 모달과 결과 토스트를 렌더링
 */
export default function GroupActionModals({
  deleteMemberTarget,
  groupActionConfirm,
  showDeleteToast,
  showQuitToast,
  showGroupDeleteToast,
  showErrorToast,
  errorMessage,
  onCloseDeleteMember,
  onConfirmDeleteMember,
  onCloseGroupAction,
  onConfirmQuitGroup,
  onConfirmDeleteGroup,
  onCloseDeleteToast,
  onCloseQuitToast,
  onCloseGroupDeleteToast,
  onCloseErrorToast,
}: GroupActionModalsProps) {
  return (
    <>
      {deleteMemberTarget && (
        <ConfirmModal
          nickname={deleteMemberTarget.nickname}
          question="님을 삭제하시겠습니까?"
          onClose={onCloseDeleteMember}
          onConfirm={onConfirmDeleteMember}
          showOverlay={true}
        />
      )}
      {showDeleteToast && (
        <ToastModal
          text="그룹원이 삭제되었습니다."
          isVisible={showDeleteToast}
          onClose={onCloseDeleteToast}
        />
      )}
      {groupActionConfirm === "quit" && (
        <ConfirmModal
          question="그룹을 탈퇴하시겠습니까?"
          onClose={onCloseGroupAction}
          onConfirm={onConfirmQuitGroup}
        />
      )}
      {showQuitToast && (
        <ToastModal
          text="그룹을 탈퇴하였습니다."
          isVisible={showQuitToast}
          onClose={onCloseQuitToast}
        />
      )}
      {groupActionConfirm === "delete" && (
        <ConfirmModal
          question="그룹을 삭제하시겠습니까?"
          onClose={onCloseGroupAction}
          onConfirm={onConfirmDeleteGroup}
        />
      )}
      {showGroupDeleteToast && (
        <ToastModal
          text="그룹이 삭제되었습니다."
          isVisible={showGroupDeleteToast}
          onClose={onCloseGroupDeleteToast}
        />
      )}
      {showErrorToast && (
        <ToastModal
          isVisible={showErrorToast}
          onClose={onCloseErrorToast}
          text={errorMessage}
        />
      )}
    </>
  );
}

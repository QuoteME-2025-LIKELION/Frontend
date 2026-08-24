import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";

export type GroupMemberActionTarget = {
  id: number;
  nickname: string;
};

export type GroupActionConfirm = "quit" | "delete" | null;

interface GroupActionModalsProps {
  deleteMemberTarget: GroupMemberActionTarget | null;
  deletedMemberName: string;
  groupActionConfirm: GroupActionConfirm;
  showDeleteToast: boolean;
  showFullGroupToast: boolean;
  showErrorToast: boolean;
  errorMessage: string;
  onCloseDeleteMember: () => void;
  onConfirmDeleteMember: () => void;
  onCloseGroupAction: () => void;
  onConfirmQuitGroup: () => void;
  onConfirmDeleteGroup: () => void;
  onCloseDeleteToast: () => void;
  onCloseFullGroupToast: () => void;
  onCloseErrorToast: () => void;
}

/**
 * 그룹 상세 화면의 확인 모달과 결과 토스트를 렌더링
 */
export default function GroupActionModals({
  deleteMemberTarget,
  deletedMemberName,
  groupActionConfirm,
  showDeleteToast,
  showFullGroupToast,
  showErrorToast,
  errorMessage,
  onCloseDeleteMember,
  onConfirmDeleteMember,
  onCloseGroupAction,
  onConfirmQuitGroup,
  onConfirmDeleteGroup,
  onCloseDeleteToast,
  onCloseFullGroupToast,
  onCloseErrorToast,
}: GroupActionModalsProps) {
  return (
    <>
      {deleteMemberTarget && (
        <ConfirmModal
          question=""
          lines={[
            `${deleteMemberTarget.nickname}님을 그룹에서`,
            "탈퇴시키겠어요?",
          ]}
          onClose={onCloseDeleteMember}
          onConfirm={onConfirmDeleteMember}
          showOverlay={true}
          cancelText="돌아가기"
          confirmText="탈퇴시키기"
          confirmColor="danger"
          variant="card"
        />
      )}
      {showDeleteToast && (
        <ToastModal
          text={`${deletedMemberName}님을 탈퇴시켰습니다`}
          isVisible={showDeleteToast}
          onClose={onCloseDeleteToast}
          showOverlay={false}
          variant="snackbar"
        />
      )}
      {groupActionConfirm === "quit" && (
        <ConfirmModal
          question=""
          lines={["그룹에서", "탈퇴하시겠어요?"]}
          onClose={onCloseGroupAction}
          onConfirm={onConfirmQuitGroup}
          cancelText="돌아가기"
          confirmText="탈퇴하기"
          confirmColor="danger"
          variant="card"
          description="탈퇴해도 재가입 요청을 보낼 수 있어요."
        />
      )}
      {groupActionConfirm === "delete" && (
        <ConfirmModal
          question=""
          lines={["그룹을", "해체하시겠어요?"]}
          onClose={onCloseGroupAction}
          onConfirm={onConfirmDeleteGroup}
          cancelText="돌아가기"
          confirmText="해체하기"
          confirmColor="danger"
          variant="card"
        />
      )}
      {showFullGroupToast && (
        <ToastModal
          text=""
          redText="정원이 가득 차 더이상 초대할 수 없습니다"
          isVisible={showFullGroupToast}
          onClose={onCloseFullGroupToast}
          showOverlay={false}
          variant="snackbar"
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

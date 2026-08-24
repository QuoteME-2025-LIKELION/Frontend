import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";
import type { Group } from "@/types/group.type";

export type FriendActionTarget = {
  id: number;
  nickname: string;
};

interface FriendGroupModalsProps {
  deleteTarget: FriendActionTarget | null;
  addTarget: FriendActionTarget | null;
  groupJoinTarget: Group | null;
  showDeleteToast: boolean;
  deletedFriendName: string;
  showAddToast: boolean;
  showGroupJoinRequestToast: boolean;
  showErrorToast: boolean;
  errorMessage: string;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
  onCloseAddModal: () => void;
  onConfirmAdd: () => void;
  onCloseGroupJoinModal: () => void;
  onConfirmGroupJoin: () => void;
  onCloseDeleteToast: () => void;
  onCloseAddToast: () => void;
  onCloseGroupJoinRequestToast: () => void;
  onCloseErrorToast: () => void;
}

/**
 * 친구 요청/삭제 확인 모달과 결과 토스트를 한 곳에서 렌더링
 */
export default function FriendGroupModals({
  deleteTarget,
  addTarget,
  groupJoinTarget,
  showDeleteToast,
  deletedFriendName,
  showAddToast,
  showGroupJoinRequestToast,
  showErrorToast,
  errorMessage,
  onCloseDeleteModal,
  onConfirmDelete,
  onCloseAddModal,
  onConfirmAdd,
  onCloseGroupJoinModal,
  onConfirmGroupJoin,
  onCloseDeleteToast,
  onCloseAddToast,
  onCloseGroupJoinRequestToast,
  onCloseErrorToast,
}: FriendGroupModalsProps) {
  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          question=""
          lines={[`${deleteTarget.nickname}님을 친구에서`, "삭제하시겠어요?"]}
          onClose={onCloseDeleteModal}
          onConfirm={onConfirmDelete}
          showOverlay={true}
          cancelText="돌아가기"
          confirmText="삭제하기"
          confirmColor="danger"
          variant="card"
        />
      )}
      {showDeleteToast && (
        <ToastModal
          text={`${deletedFriendName}님이 친구에서 삭제되었습니다.`}
          isVisible={showDeleteToast}
          onClose={onCloseDeleteToast}
          showOverlay={false}
          variant="snackbar"
        />
      )}
      {addTarget && (
        <ConfirmModal
          nickname={addTarget.nickname}
          question="님에게 친구 요청을 보낼까요?"
          onClose={onCloseAddModal}
          onConfirm={onConfirmAdd}
          showOverlay={true}
        />
      )}
      {showAddToast && (
        <ToastModal
          text="친구 요청을 보냈습니다."
          isVisible={showAddToast}
          onClose={onCloseAddToast}
          showOverlay={false}
          variant="snackbar"
        />
      )}
      {groupJoinTarget && (
        <ConfirmModal
          question=""
          lines={[
            `${groupJoinTarget.name ?? "그룹"} 그룹에`,
            "가입 요청을 보내시겠어요?",
          ]}
          onClose={onCloseGroupJoinModal}
          onConfirm={onConfirmGroupJoin}
          showOverlay={true}
          cancelText="돌아가기"
          confirmText="보내기"
          confirmColor="primary"
          variant="card"
        />
      )}
      {showGroupJoinRequestToast && (
        <ToastModal
          text="참여 요청을 보냈습니다."
          isVisible={showGroupJoinRequestToast}
          onClose={onCloseGroupJoinRequestToast}
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

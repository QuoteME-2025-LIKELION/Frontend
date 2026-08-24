import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import ToastModal from "@/components/ToastModal/ToastModal";

export type FriendActionTarget = {
  id: number;
  nickname: string;
};

interface FriendGroupModalsProps {
  deleteTarget: FriendActionTarget | null;
  addTarget: FriendActionTarget | null;
  showDeleteToast: boolean;
  deletedFriendName: string;
  showAddToast: boolean;
  showErrorToast: boolean;
  errorMessage: string;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
  onCloseAddModal: () => void;
  onConfirmAdd: () => void;
  onCloseDeleteToast: () => void;
  onCloseAddToast: () => void;
  onCloseErrorToast: () => void;
}

/**
 * 친구 요청/삭제 확인 모달과 결과 토스트를 한 곳에서 렌더링
 */
export default function FriendGroupModals({
  deleteTarget,
  addTarget,
  showDeleteToast,
  deletedFriendName,
  showAddToast,
  showErrorToast,
  errorMessage,
  onCloseDeleteModal,
  onConfirmDelete,
  onCloseAddModal,
  onConfirmAdd,
  onCloseDeleteToast,
  onCloseAddToast,
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
          text={`${deletedFriendName}님이 친구에서 삭제되었습니다`}
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
          text="친구 요청을 보냈습니다"
          isVisible={showAddToast}
          onClose={onCloseAddToast}
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

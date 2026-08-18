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
          nickname={deleteTarget.nickname}
          question="님을 삭제하시겠습니까?"
          onClose={onCloseDeleteModal}
          onConfirm={onConfirmDelete}
          showOverlay={true}
        />
      )}
      {showDeleteToast && (
        <ToastModal
          text="친구가 삭제되었습니다."
          isVisible={showDeleteToast}
          onClose={onCloseDeleteToast}
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

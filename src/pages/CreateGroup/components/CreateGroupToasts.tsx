import ToastModal from "@/components/ToastModal/ToastModal";

interface CreateGroupToastsProps {
  showErrorToast: boolean;
  errorMessage: string;
  onCloseErrorToast: () => void;
}

/**
 * 그룹 생성 성공/실패 토스트를 렌더링
 */
export default function CreateGroupToasts({
  showErrorToast,
  errorMessage,
  onCloseErrorToast,
}: CreateGroupToastsProps) {
  return (
    <>
      {showErrorToast && (
        <ToastModal
          isVisible={showErrorToast}
          onClose={onCloseErrorToast}
          text={errorMessage}
          showOverlay={false}
          variant="snackbar"
        />
      )}
    </>
  );
}

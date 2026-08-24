import ToastModal from "@/components/ToastModal/ToastModal";

interface CreateGroupToastsProps {
  showErrorToast: boolean;
  errorMessage: string;
  errorMessage3: string;
  onCloseErrorToast: () => void;
}

/**
 * 그룹 생성 성공/실패 토스트를 렌더링
 */
export default function CreateGroupToasts({
  showErrorToast,
  errorMessage,
  errorMessage3,
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
          {...(errorMessage3 && { text3: errorMessage3 })}
        />
      )}
    </>
  );
}

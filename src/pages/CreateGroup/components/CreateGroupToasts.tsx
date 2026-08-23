import ToastModal from "@/components/ToastModal/ToastModal";

interface CreateGroupToastsProps {
  showSuccessToast: boolean;
  showErrorToast: boolean;
  errorMessage: string;
  errorMessage3: string;
  onCloseSuccessToast: () => void;
  onCloseErrorToast: () => void;
}

/**
 * 그룹 생성 성공/실패 토스트를 렌더링
 */
export default function CreateGroupToasts({
  showSuccessToast,
  showErrorToast,
  errorMessage,
  errorMessage3,
  onCloseSuccessToast,
  onCloseErrorToast,
}: CreateGroupToastsProps) {
  return (
    <>
      {showSuccessToast && (
        <ToastModal
          isVisible={showSuccessToast}
          text="그룹이 생성되었습니다."
          onClose={onCloseSuccessToast}
          showOverlay={false}
          variant="snackbar"
        />
      )}
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

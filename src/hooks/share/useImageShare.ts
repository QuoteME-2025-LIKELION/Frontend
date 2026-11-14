import { useCallback, useEffect, useState } from "react";

export type ImageShareStatus = "nothing" | "sharing" | "completed";
export type ImageShareProcess = () => Promise<void>;

/**
 * 이미지 공유/저장 프로세스 실행 상태와 실패 토스트 상태를 관리하는 훅
 */
export function useImageShare() {
  const [shareStatus, setShareStatus] =
    useState<ImageShareStatus>("nothing");
  const [showShareErrorToast, setShowShareErrorToast] = useState(false);

  const resetShareStatus = useCallback(() => {
    setShareStatus("nothing");
  }, []);

  const closeShareErrorToast = useCallback(() => {
    setShowShareErrorToast(false);
  }, []);

  const executeShare = useCallback(async (shareProcess: ImageShareProcess) => {
    setShareStatus("sharing");
    try {
      await shareProcess();
      setShareStatus("completed");
    } catch (error) {
      console.error("Share failed", error);
      setShowShareErrorToast(true);
      setShareStatus("nothing");
    }
  }, []);

  useEffect(() => {
    if (shareStatus !== "completed") return;

    const timer = setTimeout(() => {
      setShareStatus("nothing");
    }, 1500);

    return () => clearTimeout(timer);
  }, [shareStatus]);

  return {
    shareStatus,
    showShareErrorToast,
    executeShare,
    resetShareStatus,
    closeShareErrorToast,
  };
}

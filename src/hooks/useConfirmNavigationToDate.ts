import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 날짜별 홈 화면 이동 전 확인 모달 상태와 이동 처리를 관리하는 훅
 */
export function useConfirmNavigationToDate() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const openDateNavigationConfirm = useCallback((date: string) => {
    setSelectedDate(date);
    setIsConfirmOpen(true);
  }, []);

  const closeDateNavigationConfirm = useCallback(() => {
    setSelectedDate(null);
    setIsConfirmOpen(false);
  }, []);

  const confirmDateNavigation = useCallback(() => {
    if (!selectedDate) {
      closeDateNavigationConfirm();
      return;
    }

    navigate(`/home/${selectedDate}`);
    closeDateNavigationConfirm();
  }, [closeDateNavigationConfirm, navigate, selectedDate]);

  return {
    isDateNavigationConfirmOpen: isConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  };
}

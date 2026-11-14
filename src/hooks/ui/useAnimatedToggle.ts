import { useCallback, useEffect, useState } from "react";

/**
 * 토글 상태와 애니메이션 종료 후 렌더링 해제를 함께 관리하는 훅
 * @param animationDuration 애니메이션이 끝날 때까지 기다릴 시간 (ms)
 */
export default function useAnimatedToggle(animationDuration = 300) {
  const [active, setActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const open = useCallback(() => {
    setIsVisible(true);
    setActive(true);
  }, []);

  const close = useCallback(() => {
    setActive(false);
  }, []);

  const toggle = useCallback(() => {
    setActive((prev) => {
      const next = !prev;

      if (next) {
        setIsVisible(true);
      }

      return next;
    });
  }, []);

  useEffect(() => {
    if (active) {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, animationDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [active, animationDuration]);

  return {
    active,
    open,
    toggle,
    isVisible,
    close,
  };
}

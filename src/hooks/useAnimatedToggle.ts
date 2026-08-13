import { useCallback, useEffect, useState } from "react";

/**
 * 토글 상태와 애니메이션 종료 후 렌더링 해제를 함께 관리하는 훅
 * @param animationDuration 애니메이션이 끝날 때까지 기다릴 시간 (ms)
 */
export default function useAnimatedToggle(animationDuration = 300) {
  const [active, setActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const close = useCallback(() => {
    setActive(false);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (active) {
      setIsVisible(true);
    } else {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, animationDuration);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [active, animationDuration]);

  return {
    active,
    setActive,
    isVisible,
    close,
  };
}

import { useState, useEffect } from "react";

/**
 * Search 컴포넌트와 함께 사용하여 사용자의 입력이 멈춘 후에만 검색을 수행하도록 하는 디바운스 훅
 * @param value 디바운싱할 값
 * @param delay 지연 시간 (ms)
 * @returns 디바운싱된 값
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 이후에 debouncedValue를 업데이트하는 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value가 바뀌면 이전 타이머를 정리하고 새 타이머를 설정
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
/**
 * 날짜 문자열 또는 Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
 * @param date - 변환할 날짜 (string 또는 Date)
 * @returns 포맷팅된 날짜 문자열 (e.g., '2025-12-15')
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  // month는 0부터 시작하므로 +1 후 두 자리로 패딩
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

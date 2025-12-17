/**
 * - ISO 형식의 날짜 문자열을 받아 'MM/DD' 형식의 날짜와 요일을 반환하는 함수
 * - 아카이브 - 나의 명언 페이지에서 사용
 * @param isoString 'YYYY-MM-DDTHH:mm:ss.sss' 형식의 날짜 문자열
 * @returns { date: 'MM/DD', day: '요일' } 형태의 객체
 */
export function formatDateDay(isoString: string): {
  date: string;
  day: string;
} {
  const dateObj = new Date(isoString);

  // MM/DD 형식으로 포맷팅
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(dateObj.getDate()).padStart(2, "0");
  const formattedDate = `${month}/${dayOfMonth}`;

  // 요일 계산
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const dayOfWeek = days[dateObj.getDay()];

  return {
    date: formattedDate,
    day: dayOfWeek,
  };
}

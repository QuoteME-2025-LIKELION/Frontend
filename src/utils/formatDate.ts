/**
 * 날짜 문자열 또는 Date 객체를 'dec 12 금요일' 형식으로 변환하는 함수
 * @param dateInput - 변환할 날짜 (string 또는 Date)
 * @returns 포맷팅된 날짜 문자열 (e.g., 'dec 12 금요일')
 */
export const formatCustomDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
  console.log(month);
  const day = date.getDate();
  const weekday = date.toLocaleDateString("ko-KR", { weekday: "long" });

  return `${month} ${day} ${weekday}`;
};

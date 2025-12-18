/**
 * 날짜 문자열 또는 Date 객체를 'dec 12 금요일' 형식으로 변환하는 함수
 * @param dateInput - 변환할 날짜 (string 또는 Date)
 * @returns 포맷팅된 날짜 문자열 (e.g., 'dec 12 금요일')
 */
export const formatCustomDate = (dateInput: string | Date): string => {
  let date: Date;

  if (typeof dateInput === "string") {
    // YYYY-MM-DD 형식인 경우 타임존 문제를 방지하기 위해 '-'로 분리하여 생성
    if (dateInput.includes("-") && !dateInput.includes("T")) {
      const [year, month, day] = dateInput.split("-").map(Number);
      // month는 0부터 시작하므로 -1
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateInput);
    }
  } else {
    date = dateInput;
  }

  // 날짜 변환이 실패했을 경우(Invalid Date) 처리
  if (isNaN(date.getTime())) {
    return "유효하지 않은 날짜";
  }

  const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const day = date.getDate();
  const weekday = date.toLocaleDateString("ko-KR", { weekday: "long" });

  return `${month} ${day} ${weekday}`;
};

/** 기존 달력과 같이 브라우저의 현지 날짜를 기준으로 비교한다. */
export function isFutureArchiveDate(date: Date, today = new Date()) {
  return (
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() >
    new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  );
}

/** 월말을 보정하고, 자동 선택되는 날짜가 오늘을 넘지 않도록 한다. */
export function getArchiveDateInMonth(
  baseDate: Date,
  year: number,
  month: number,
  today = new Date()
) {
  const lastDate = new Date(year, month + 1, 0).getDate();
  const candidate = new Date(
    year,
    month,
    Math.min(baseDate.getDate(), lastDate)
  );
  return isFutureArchiveDate(candidate, today)
    ? new Date(today.getFullYear(), today.getMonth(), today.getDate())
    : candidate;
}

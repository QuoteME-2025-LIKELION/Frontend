import { useState } from "react";
import * as S from "./CalendarPageStyle";
import Calendar from "react-calendar";
import { Global } from "@emotion/react";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const selectedDate = new Date(2025, 10, 5);
const markedDate = new Date(2025, 10, 7);

export default function CalendarPage() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <S.Container>
      {/* StyledCalendar 사용 */}
      <Global styles={S.CalendarStyles} />
      <Calendar
        onChange={onChange}
        value={value}
        showNavigation={true}
        showNeighboringMonth={true}
        formatMonthYear={(locale, date) => {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          return `${year}. ${String(month).padStart(2, "0")}`;
        }}
        formatShortWeekday={(locale, date) => {
          const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
          // 캘린더는 기본적으로 일요일부터 시작하므로 date.getDay()를 사용해 인덱싱
          return weekdays[date.getDay()];
        }}
        formatDay={(locale, date) =>
          date.toLocaleString("en", { day: "numeric" })
        }
        nextLabel={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="#143858"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        prevLabel={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="#143858"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </S.Container>
  );
}

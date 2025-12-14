import { useCallback, useEffect, useState } from "react";
import * as S from "./CalendarPageStyle";
import Calendar from "react-calendar";
import { Global } from "@emotion/react";
import Feed from "@/components/Feed/Feed";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import type { ArchiveFeed } from "@/types/archiveFeed.type";
import api from "@/api/api";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";
import { useNavigate } from "react-router-dom";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarPage() {
  const [value, onChange] = useState<Value>(new Date());
  const [filteredFeeds, setFilteredFeeds] = useState<ArchiveFeed[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // 이거는 페이지 이동 시 사용
  const [selectedFeedDate, setSelectedFeedDate] = useState<string | null>(null);

  // 달력 클릭 시 사용
  useEffect(() => {
    let selectedDate: Date | null = null;

    if (value instanceof Date) {
      selectedDate = value;
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof Date
    ) {
      selectedDate = value[0];
    } else {
      setFilteredFeeds([]);
      return;
    }

    if (selectedDate) {
      const selectedDateString = formatDateToYYYYMMDD(selectedDate);
      const fetchFeeds = async () => {
        try {
          const res = await api.get(`/archives?date=${selectedDateString}`);
          setFilteredFeeds(res.data);
        } catch (error) {
          console.error("Error fetching archives:", error);
          setFilteredFeeds([]);
        }
      };

      fetchFeeds();
    }
  }, [value]);

  const handleArchiveClick = useCallback((date: string) => {
    setSelectedFeedDate(date); // 날짜 저장
    setShowModal(true); // 모달 열기
  }, []);

  const moveToDate = useCallback((date: string) => {
    navigate(`/home/${date}`);
    setShowModal(false); // 이동 후 모달 닫기
  }, []);

  const handleConfirmMove = useCallback(() => {
    if (selectedFeedDate) {
      moveToDate(selectedFeedDate); // 저장된 날짜로 이동 함수 호출
    } else {
      setShowModal(false);
    }
  }, [selectedFeedDate, moveToDate]);

  return (
    <S.Container>
      {showModal && (
        <ConfirmModal
          question="해당 날짜로 이동할까요?"
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmMove}
          showOverlay={true}
        />
      )}
      <Global styles={S.CalendarStyles} />
      <Calendar
        onChange={onChange}
        value={value}
        showNavigation={true}
        showNeighboringMonth={true}
        formatMonthYear={(_, date) => {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          return `${year}. ${String(month).padStart(2, "0")}`;
        }}
        formatShortWeekday={(_, date) => {
          const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
          // 캘린더는 기본적으로 일요일부터 시작하므로 date.getDay()를 사용해 인덱싱
          return weekdays[date.getDay()];
        }}
        formatDay={(_, date) => date.toLocaleString("en", { day: "numeric" })}
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
      <S.FeedContainer>
        {filteredFeeds.length > 0 &&
          filteredFeeds.map((feed) => (
            <Feed
              key={feed.id}
              authorName={feed.authorName}
              year={feed.authorBirthYear}
              content={feed.content}
              tag={feed.taggedMemberNames}
              isInArchive={true}
              onArchiveClick={() =>
                handleArchiveClick(feed.createDate.slice(0, 10))
              }
            />
          ))}
      </S.FeedContainer>
    </S.Container>
  );
}

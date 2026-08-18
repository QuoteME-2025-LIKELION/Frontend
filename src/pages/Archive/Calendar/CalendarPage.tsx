import { Global } from "@emotion/react";
import { useMemo, useRef, useState } from "react";
import Calendar from "react-calendar";
import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import QuoteFeed from "@/components/QuoteFeed/QuoteFeed";
import { useArchivesByDateQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";

import * as S from "./CalendarPage.styles";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarPage() {
  const [value, onChange] = useState<Value>(new Date());
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();
  const {
    isDateNavigationConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  } = useConfirmNavigationToDate();

  const { onShare } = useOutletContext<ArchiveOutletContext>();
  const selectedDateString = useMemo(() => {
    if (value instanceof Date) {
      return formatDateToYYYYMMDD(value);
    }

    if (Array.isArray(value) && value.length > 0 && value[0] instanceof Date) {
      return formatDateToYYYYMMDD(value[0]);
    }

    return null;
  }, [value]);
  const { data: filteredFeeds = [] } =
    useArchivesByDateQuery(selectedDateString);

  const handleShare = (date: string, authorNickname: string, index: number) => {
    const shareProcess = () =>
      downloadElementImage(
        feedRefs.current[index],
        `QuoteMe-${date}-${authorNickname}.png`
      );

    onShare(shareProcess);
  };

  return (
    <S.Container>
      {isDateNavigationConfirmOpen && (
        <ConfirmModal
          question="해당 날짜로 이동할까요?"
          onClose={closeDateNavigationConfirm}
          onConfirm={confirmDateNavigation}
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
          filteredFeeds.map((feed, index) => (
            <QuoteFeed
              key={feed.id}
              ref={(el: HTMLDivElement | null) => {
                feedRefs.current[index] = el;
              }}
              authorName={feed.authorName}
              year={feed.authorBirthYear}
              content={feed.content}
              tag={feed.taggedMemberNames}
              isInArchive={true}
              onArchiveClick={() =>
                openDateNavigationConfirm(feed.createDate.slice(0, 10))
              }
              onShare={() =>
                handleShare(
                  feed.createDate.slice(0, 10),
                  feed.authorName,
                  index
                )
              }
            />
          ))}
      </S.FeedContainer>
    </S.Container>
  );
}

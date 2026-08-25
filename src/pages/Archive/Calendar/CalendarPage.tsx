import { useRef } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useArchivesByDateQuery } from "@/hooks/useArchiveQueries";
import { useConfirmNavigationToDate } from "@/hooks/useConfirmNavigationToDate";
import { useElementImageDownload } from "@/hooks/useElementImageDownload";
import type { ArchiveOutletContext } from "@/pages/Archive/archiveOutletContext.type";
import * as List from "@/pages/Archive/components/ArchiveFeedList.styles";
import ArchiveQuoteCard from "@/pages/Archive/components/ArchiveQuoteCard";

export default function CalendarPage() {
  const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const downloadElementImage = useElementImageDownload();
  const {
    isDateNavigationConfirmOpen,
    openDateNavigationConfirm,
    closeDateNavigationConfirm,
    confirmDateNavigation,
  } = useConfirmNavigationToDate();

  const { onShare, selectedDateString } =
    useOutletContext<ArchiveOutletContext>();
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
    <List.Container>
      {isDateNavigationConfirmOpen && (
        <ConfirmModal
          question="해당 날짜로 이동할까요?"
          onClose={closeDateNavigationConfirm}
          onConfirm={confirmDateNavigation}
          showOverlay={true}
        />
      )}
      {filteredFeeds.length === 0 && (
        <List.EmptyMessage>작성된 명언이 없습니다</List.EmptyMessage>
      )}
      {filteredFeeds.map((feed, index) => {
        const date = (feed.createDate ?? feed.createdAt ?? "").slice(0, 10);
        const authorName = feed.authorName ?? feed.authorNickname ?? "닉네임";

        return (
          <ArchiveQuoteCard
            key={feed.id ?? feed.quoteId}
            ref={(el: HTMLDivElement | null) => {
              feedRefs.current[index] = el;
            }}
            feed={feed}
            onClick={() => openDateNavigationConfirm(date)}
            onShare={() => handleShare(date, authorName, index)}
          />
        );
      })}
    </List.Container>
  );
}
